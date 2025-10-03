import { motion } from 'motion/react';
import { Plus, ArrowUpRight, ArrowDownLeft, Gift, CreditCard, TrendingUp, Clock, Download } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const transactions = [
  {
    id: 1,
    type: 'credit',
    amount: 100,
    description: 'Referral bonus - John invited Sarah',
    date: '2024-01-15',
    time: '14:30',
    status: 'completed',
    icon: Gift
  },
  {
    id: 2,
    type: 'debit',
    amount: 75,
    description: 'Delivery payment #SPD001',
    date: '2024-01-15',
    time: '12:45',
    status: 'completed',
    icon: CreditCard
  },
  {
    id: 3,
    type: 'credit',
    amount: 200,
    description: 'Wallet top-up via UPI',
    date: '2024-01-14',
    time: '16:20',
    status: 'completed',
    icon: Plus
  },
  {
    id: 4,
    type: 'credit',
    amount: 50,
    description: 'Cashback - Order #SPD002',
    date: '2024-01-13',
    time: '11:15',
    status: 'completed',
    icon: TrendingUp
  },
  {
    id: 5,
    type: 'pending',
    amount: 100,
    description: 'Referral bonus (pending)',
    date: '2024-01-12',
    time: '09:30',
    status: 'pending',
    icon: Clock
  }
];

export function WalletScreen() {
  const balance = 1250;
  const pendingAmount = 100;
  const monthlySpending = 450;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl mb-1">Wallet</h1>
          <p className="text-gray-600 text-sm">Manage your payments</p>
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 scroll-container">
        {/* Wallet Balance Card */}
        <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg opacity-90">Wallet Balance</h2>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹{balance}</span>
                <span className="text-sm opacity-75 ml-2">Available</span>
              </div>
              
              {pendingAmount > 0 && (
                <div className="mb-4">
                  <span className="text-sm opacity-75">₹{pendingAmount} pending</span>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" className="flex-1 bg-white/20 text-white border-0 hover:bg-white/30 cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 bg-white/20 text-white border-0 hover:bg-white/30 cursor-pointer">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Send Money
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Summary */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">This Month</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Money Spent</p>
                  <p className="text-lg font-semibold text-red-600">₹{monthlySpending}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Money Earned</p>
                  <p className="text-lg font-semibold text-green-600">₹350</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xs font-medium">Add Money</h3>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xs font-medium">Rewards</h3>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xs font-medium">Statement</h3>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Premium Wallet Ad */}
      <div className="px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 shadow-lg cursor-pointer overflow-hidden">
            <CardContent className="p-4 relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-3 -translate-x-3"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <CreditCard className="w-3 h-3 text-orange-600" />
                      </div>
                      <Badge className="bg-white/20 text-white text-xs border-0">
                        PREMIUM WALLET
                      </Badge>
                    </div>
                    <h3 className="text-white text-sm mb-1">Upgrade to Premium</h3>
                    <p className="text-white/90 text-xs mb-2">2% cashback on all deliveries</p>
                    <p className="text-yellow-200 text-xs">Just ₹99/month</p>
                  </div>
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

        {/* Transaction History */}
        <div className="px-6 pb-24 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm">{transaction.description}</h3>
                            <p className="text-xs text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`block text-xs mt-1 ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}