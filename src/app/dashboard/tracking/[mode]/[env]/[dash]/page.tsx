import { getUserAction } from "@/actions/auth-actions";
import { isAlignUsername } from "@/lib/user-access";
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
	const isAlignUser = success ? isAlignUsername(data?.username) : false;

	return (
		<>
			<DashboardPage mode={param.mode} dash={param.dash} isAlignUser={isAlignUser} />
		</>
	);
};

export default SlugPage;
