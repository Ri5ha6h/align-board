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
	const [param, userResult] = await Promise.all([params, getUserAction()]);
	const { data, success } = userResult;
	const isAlignUser = success ? isAlignUsername(data?.username) : false;

	return (
		<>
			<DashboardPage dash={param.dash} isAlignUser={isAlignUser} />
		</>
	);
};

export default SlugPage;
