import OrgSideBar from "./_components/OrgSideBar";
import SideBar from "./_components/SideBar";

interface DashBoardLayoutProps {
    children: React.ReactNode,
}

const DashboardLayout = ({
    children,
}: DashBoardLayoutProps) => {
    return(
        <main
            className="
                h-full
            "
        >
            <SideBar />
            <div
                className="
                    pl-[60px]
                    h-full
                "
            >
                <div 
                    className="flex gap-x-3 h-full"
                >
                    <OrgSideBar />
                    <div className="h-full flex-1">
                        {/* Add Navbar */}
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DashboardLayout;