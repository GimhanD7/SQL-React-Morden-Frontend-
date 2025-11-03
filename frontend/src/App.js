import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Table, Columns, Plus } from 'lucide-react';
import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { ErrorAlert, SuccessAlert } from './components/Alert';
import EmptyState from './components/EmptyState';
import TableList from './components/TableList';
import ColumnsTable from './components/ColumnsTable';
import CreateTableModal from './components/CreateTableModal';
import AddColumnModal from './components/AddColumnModal';
import RenameColumnModal from './components/RenameColumnModal';

const API_BASE_URL = 'http://localhost/SQL/backend';

function App() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState('tables');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [renameColumnData, setRenameColumnData] = useState({ oldName: '', newName: '' });
  
  const [newTableName, setNewTableName] = useState('');
  const [newTableColumns, setNewTableColumns] = useState([{
    name: 'id',
    type: 'INT',
    length: '11',
    nullable: false,
    autoIncrement: true,
    primaryKey: true,
    default: ''
  }]);
  
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'VARCHAR',
    length: '255',
    nullable: false,
    autoIncrement: false,
    default: ''
  });

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabase) {
      loadTables();
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (selectedTable && selectedDatabase) {
      loadColumns();
    }
  }, [selectedTable, selectedDatabase]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const loadDatabases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/databases.php`);
      if (response.data.success) {
        setDatabases(response.data.data);
      }
    } catch (err) {
      showError('Failed to load databases');
    } finally {
      setLoading(false);
    }
  };

  const createDatabase = async (e) => {
    e.preventDefault();
    if (!newDatabaseName.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/databases.php`, {
        name: newDatabaseName
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        setNewDatabaseName('');
        loadDatabases();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create database');
    } finally {
      setLoading(false);
    }
  };

  const deleteDatabase = async (dbName) => {
    if (!window.confirm(`Are you sure you want to delete database "${dbName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/databases.php`, {
        data: { name: dbName }
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        if (selectedDatabase === dbName) {
          setSelectedDatabase(null);
          setTables([]);
          setSelectedTable(null);
          setColumns([]);
        }
        loadDatabases();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete database');
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tables.php?database=${selectedDatabase}`);
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (err) {
      showError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim() || newTableColumns.length === 0) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/tables.php`, {
        database: selectedDatabase,
        tableName: newTableName,
        columns: newTableColumns
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        setShowCreateTableModal(false);
        setNewTableName('');
        setNewTableColumns([{
          name: 'id',
          type: 'INT',
          length: '11',
          nullable: false,
          autoIncrement: true,
          primaryKey: true,
          default: ''
        }]);
        loadTables();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create table');
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (tableName) => {
    if (!window.confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/tables.php`, {
        data: { 
          database: selectedDatabase,
          tableName: tableName 
        }
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        if (selectedTable === tableName) {
          setSelectedTable(null);
          setColumns([]);
        }
        loadTables();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete table');
    } finally {
      setLoading(false);
    }
  };

  const loadColumns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/columns.php?database=${selectedDatabase}&table=${selectedTable}`
      );
      if (response.data.success) {
        setColumns(response.data.data);
      }
    } catch (err) {
      showError('Failed to load columns');
    } finally {
      setLoading(false);
    }
  };

  const addColumn = async (e) => {
    e.preventDefault();
    if (!newColumn.name.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/columns.php`, {
        database: selectedDatabase,
        table: selectedTable,
        column: newColumn
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        setShowAddColumnModal(false);
        setNewColumn({
          name: '',
          type: 'VARCHAR',
          length: '255',
          nullable: false,
          autoIncrement: false,
          default: ''
        });
        loadColumns();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add column');
    } finally {
      setLoading(false);
    }
  };

  const renameColumn = async (e) => {
    e.preventDefault();
    if (!renameColumnData.newName.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/columns.php`, {
        database: selectedDatabase,
        table: selectedTable,
        oldName: renameColumnData.oldName,
        newName: renameColumnData.newName
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        setShowRenameColumnModal(false);
        setRenameColumnData({ oldName: '', newName: '' });
        loadColumns();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to rename column');
    } finally {
      setLoading(false);
    }
  };

  const deleteColumn = async (columnName) => {
    if (!window.confirm(`Are you sure you want to delete column "${columnName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/columns.php`, {
        data: {
          database: selectedDatabase,
          table: selectedTable,
          columnName: columnName
        }
      });
      
      if (response.data.success) {
        showSuccess(response.data.message);
        loadColumns();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <Sidebar
          databases={databases}
          selectedDatabase={selectedDatabase}
          onSelectDatabase={(db) => {
            setSelectedDatabase(db);
            setSelectedTable(null);
            setColumns([]);
          }}
          onDeleteDatabase={deleteDatabase}
          newDatabaseName={newDatabaseName}
          setNewDatabaseName={setNewDatabaseName}
          onCreateDatabase={createDatabase}
          loading={loading}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
            {!selectedDatabase ? (
              <EmptyState
                icon={Database}
                title="No Database Selected"
                description="Select a database from the sidebar to get started"
              />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {selectedDatabase}
                  </h2>
                  <button
                    onClick={() => setShowCreateTableModal(true)}
                    className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span className="sm:inline">New Table</span>
                  </button>
                </div>

                <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('tables')}
                    className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 md:gap-2 border-b-2 whitespace-nowrap ${
                      activeTab === 'tables'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Table size={14} className="md:w-4 md:h-4" />
                    Tables
                  </button>
                  {selectedTable && (
                    <button
                      onClick={() => setActiveTab('columns')}
                      className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 md:gap-2 border-b-2 whitespace-nowrap ${
                        activeTab === 'columns'
                          ? 'border-gray-900 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Columns size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Columns - </span>{selectedTable}
                    </button>
                  )}
                </div>

                {activeTab === 'tables' && (
                  <>
                    {tables.length === 0 ? (
                      <EmptyState
                        icon={Table}
                        title="No Tables Found"
                        description="Create a table to get started"
                      />
                    ) : (
                      <TableList
                        tables={tables}
                        selectedTable={selectedTable}
                        onSelectTable={(table) => {
                          setSelectedTable(table);
                          setActiveTab('columns');
                        }}
                        onDeleteTable={deleteTable}
                      />
                    )}
                  </>
                )}

                {activeTab === 'columns' && selectedTable && (
                  <>
                    <div className="mb-4 md:mb-5">
                      <button
                        onClick={() => setShowAddColumnModal(true)}
                        className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add Column
                      </button>
                    </div>

                    {columns.length === 0 ? (
                      <EmptyState
                        icon={Columns}
                        title="No Columns Found"
                      />
                    ) : (
                      <ColumnsTable
                        columns={columns}
                        onRenameColumn={(colName) => {
                          setRenameColumnData({ oldName: colName, newName: colName });
                          setShowRenameColumnModal(true);
                        }}
                        onDeleteColumn={deleteColumn}
                      />
                    )}
                  </>
                )}
              </>
            )}
        </main>
      </div>

      <CreateTableModal
        isOpen={showCreateTableModal}
        onClose={() => setShowCreateTableModal(false)}
        tableName={newTableName}
        setTableName={setNewTableName}
        columns={newTableColumns}
        setColumns={setNewTableColumns}
        onSubmit={createTable}
        loading={loading}
      />

      <AddColumnModal
        isOpen={showAddColumnModal}
        onClose={() => setShowAddColumnModal(false)}
        column={newColumn}
        setColumn={setNewColumn}
        onSubmit={addColumn}
        loading={loading}
      />

      <RenameColumnModal
        isOpen={showRenameColumnModal}
        onClose={() => setShowRenameColumnModal(false)}
        oldName={renameColumnData.oldName}
        newName={renameColumnData.newName}
        setNewName={(name) => setRenameColumnData({ ...renameColumnData, newName: name })}
        onSubmit={renameColumn}
        loading={loading}
      />
    </div>
  );
}

export default App;
