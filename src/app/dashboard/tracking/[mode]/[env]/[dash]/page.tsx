import { getUserAction } from "@/actions/auth-actions";
import { isJTUsername } from "@/lib/user-access";
import DashboardPage from "./dashboard";

interface DashPageProps {
	params: Promise<{
		mode: string;
		env: string;
		dash: string;
	}>;
}

const SlugPage = async ({ params }: DashPageProps) => {
	const param = await params;
	const { data, success } = await getUserAction();
	const isJTUser = success ? isJTUsername(data?.username) : false;

	return (
		<>
			<DashboardPage mode={param.mode} dash={param.dash} isJTUser={isJTUser} />
		</>
	);
};

export default SlugPage;
