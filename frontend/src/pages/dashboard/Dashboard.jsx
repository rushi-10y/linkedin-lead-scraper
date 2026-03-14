import React, { useEffect, useMemo } from "react";
import { useLeads } from "../../context/LeadContext.jsx";
import Table from "../../components/common/Table.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Users, TrendingUp, Activity, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { leads = [], fetchLeads, loading } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const stats = useMemo(() => [
    {
      label: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      label: "Qualified",
      value: leads.filter(l => l.status === "qualified").length,
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      label: "Contacted",
      value: leads.filter(l => l.status === "contacted").length,
      icon: Activity,
      color: "bg-yellow-500"
    },
    {
      label: "Converted",
      value: leads.filter(l => l.status === "converted").length,
      icon: BarChart3,
      color: "bg-purple-500"
    }
  ], [leads]);

  if (loading) return <Loader />;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>

              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>

        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "company", label: "Company" },
            {
              key: "status",
              label: "Status",
              render: (val) => (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                  {val}
                </span>
              )
            },
            {
              key: "createdAt",
              label: "Created",
              render: (val) => new Date(val).toLocaleDateString()
            }
          ]}
          data={leads.slice(0, 5)}
        />
      </div>
    </>
  );
};

export default Dashboard;