import PageContainer from '../../components/layout/PageContainer.jsx';
import Table from '../../components/common/Table.jsx';

const CompanyList = () => {
  const columns = [
    { key: 'name', label: 'Company Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'location', label: 'Location' },
    { key: 'employees', label: 'Employees' }
  ];

  const data = [
    {
      id: 1,
      name: 'Tech Corp',
      industry: 'Software',
      location: 'USA',
      employees: 120
    },
    {
      id: 2,
      name: 'Acme Inc',
      industry: 'Manufacturing',
      location: 'India',
      employees: 340
    }
  ];

  return (
    <PageContainer className="py-4">
      <h1 className="text-2xl font-semibold mb-4">Companies</h1>

      <Table
        columns={columns}
        data={data}
        onRowClick={(row) => console.log('Company clicked:', row)}
      />
    </PageContainer>
  );
};

export default CompanyList;
