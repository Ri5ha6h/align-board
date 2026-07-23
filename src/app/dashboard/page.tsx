import { redirect } from "next/navigation";

const Dashboard = () => {
	redirect("/dashboard/tracking/ocean/prod/status");
};

export default Dashboard;
