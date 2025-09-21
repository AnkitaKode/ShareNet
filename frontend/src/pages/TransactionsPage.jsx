import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { toast } from 'sonner';

// A helper function to determine the badge color based on status
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'PENDING': return 'default';
    case 'APPROVED': return 'success';
    case 'DECLINED': return 'destructive';
    case 'RETURNED': return 'secondary';
    default: return 'outline';
  }
};

// --- Reusable Transaction Card Component ---
const TransactionCard = ({ transaction, isOwner, onUpdate }) => {
  const { item, borrower, owner, status } = transaction;
  const otherUser = isOwner ? borrower : owner;

  return (
    <div className="transaction-card">
      <img src={item.imageUrl} alt={item.name} className="item-image" />
      <div className="card-details">
        <div className="card-header">
          <span className="item-name">{item.name}</span>
          <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
        </div>
        <p className="user-info">
          {isOwner ? `Requested by: ${otherUser.name}` : `Owner: ${otherUser.name}`}
        </p>
      </div>
      {isOwner && status === 'PENDING' && (
        <div className="card-actions">
          <Button size="sm" onClick={() => onUpdate(transaction.id, 'APPROVED')}>Approve</Button>
          <Button size="sm" variant="destructive" onClick={() => onUpdate(transaction.id, 'DECLINED')}>Decline</Button>
        </div>
      )}
    </div>
  );
};

// --- Main Transactions Page Component ---
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This should be replaced with the actual logged-in user's ID
  const currentUserId = 1; 

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions.');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleUpdateRequest = async (transactionId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transactions/${transactionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus.toLowerCase()} request.`);
      }
      
      // Update the state locally for an instant UI update
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, status: newStatus } : t)
      );
      toast.success(`Request has been ${newStatus.toLowerCase()}.`);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading transactions...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  const borrowedItems = transactions.filter(t => t.borrower.id === currentUserId);
  const lentItems = transactions.filter(t => t.owner.id === currentUserId);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Assuming Sidebar and Header are part of your main layout */}
      {/* <Sidebar /> */}
      {/* <Header /> */}
      <main className="flex-1 p-6">
        <style>{`
          .transaction-card { display: flex; align-items-center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e5e7eb; }
          .transaction-card:last-child { border-bottom: none; }
          .item-image { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; }
          .card-details { flex-grow: 1; }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
          .item-name { font-weight: 600; color: #111827; }
          .user-info { font-size: 0.875rem; color: #6b7280; }
          .card-actions { display: flex; gap: 0.5rem; }
        `}</style>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Transactions</h1>
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="borrowed">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="borrowed">Items I've Borrowed</TabsTrigger>
                  <TabsTrigger value="lent">Requests for My Items</TabsTrigger>
                </TabsList>
                <TabsContent value="borrowed" className="p-4">
                  {borrowedItems.length > 0 ? (
                    borrowedItems.map(t => <TransactionCard key={t.id} transaction={t} isOwner={false} />)
                  ) : (
                    <p className="text-gray-500 text-center py-4">You haven't borrowed any items yet.</p>
                  )}
                </TabsContent>
                <TabsContent value="lent" className="p-4">
                  {lentItems.length > 0 ? (
                    lentItems.map(t => <TransactionCard key={t.id} transaction={t} isOwner={true} onUpdate={handleUpdateRequest} />)
                  ) : (
                    <p className="text-gray-500 text-center py-4">You have no pending requests for your items.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
