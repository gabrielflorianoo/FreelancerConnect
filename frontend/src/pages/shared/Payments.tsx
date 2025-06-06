import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import {
    DollarSign,
    Download,
    Search,
    Filter,
    CreditCard,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Payments = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [periodFilter, setPeriodFilter] = useState("all");

    const transactions = [
        {
            id: 1,
            type: user?.userType === "client" ? "payment" : "received",
            project: "Desenvolvimento de App Mobile",
            amount: 5000,
            status: "completed",
            date: "2023-12-15",
            method: "credit_card",
            partner: user?.userType === "client" ? "Ana Silva" : "João Silva",
            fee: user?.userType === "client" ? 0 : 500,
        },
        {
            id: 2,
            type: user?.userType === "client" ? "payment" : "received",
            project: "Design de Logo",
            amount: 800,
            status: "completed",
            date: "2023-12-10",
            method: "pix",
            partner:
                user?.userType === "client" ? "Carlos Santos" : "Maria Costa",
            fee: user?.userType === "client" ? 0 : 80,
        },
        {
            id: 3,
            type: user?.userType === "client" ? "payment" : "received",
            project: "Gestão de Redes Sociais",
            amount: 1200,
            status: "pending",
            date: "2023-12-12",
            method: "bank_transfer",
            partner:
                user?.userType === "client" ? "Marina Costa" : "Pedro Santos",
            fee: user?.userType === "client" ? 0 : 120,
        },
        {
            id: 4,
            type: user?.userType === "client" ? "refund" : "withdrawal",
            project: "Projeto Cancelado",
            amount: 300,
            status: "processing",
            date: "2023-12-08",
            method: "bank_transfer",
            partner: user?.userType === "client" ? "João Pedro" : "Banco",
            fee: 0,
        },
    ];

    const stats = {
        totalEarned:
            user?.userType === "client"
                ? 0
                : transactions
                      .filter(
                          (t) =>
                              t.type === "received" && t.status === "completed",
                      )
                      .reduce((acc, t) => acc + (t.amount - t.fee), 0),
        totalSpent:
            user?.userType === "client"
                ? transactions
                      .filter(
                          (t) =>
                              t.type === "payment" && t.status === "completed",
                      )
                      .reduce((acc, t) => acc + t.amount, 0)
                : 0,
        pendingAmount: transactions
            .filter((t) => t.status === "pending")
            .reduce((acc, t) => acc + t.amount, 0),
        thisMonth: user?.userType === "client" ? 2500 : 3200,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Concluído";
            case "pending":
                return "Pendente";
            case "processing":
                return "Processando";
            case "failed":
                return "Falhou";
            default:
                return status;
        }
    };

    const getMethodText = (method: string) => {
        switch (method) {
            case "credit_card":
                return "Cartão de Crédito";
            case "pix":
                return "PIX";
            case "bank_transfer":
                return "Transferência Bancária";
            default:
                return method;
        }
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.project
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.partner
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
                <p className="text-gray-600">
                    {user?.userType === "client"
                        ? "Gerencie seus pagamentos e faturas"
                        : "Acompanhe seus ganhos e saques"}
                </p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {user?.userType === "freelancer" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Ganho
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                R$ {stats.totalEarned.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Líquido após taxas
                            </p>
                        </CardContent>
                    </Card>
                )}

                {user?.userType === "client" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Gasto
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                R$ {stats.totalSpent.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Em projetos concluídos
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Valor Pendente
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {stats.pendingAmount.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aguardando processamento
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Este Mês
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {stats.thisMonth.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {user?.userType === "client" ? "Gastos" : "Ganhos"}{" "}
                            em dezembro
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros e Ações */}
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar transações..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="processing">
                                Processando
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex space-x-2">
                    {user?.userType === "freelancer" && (
                        <Button>
                            <ArrowDownLeft className="h-4 w-4 mr-2" />
                            Solicitar Saque
                        </Button>
                    )}
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Lista de Transações */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>
                        Todas as suas transações financeiras
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`p-2 rounded-full ${
                                            transaction.type === "payment"
                                                ? "bg-red-100"
                                                : transaction.type ===
                                                    "received"
                                                  ? "bg-green-100"
                                                  : transaction.type ===
                                                      "refund"
                                                    ? "bg-blue-100"
                                                    : "bg-yellow-100"
                                        }`}
                                    >
                                        {transaction.type === "payment" ? (
                                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                                        ) : transaction.type === "received" ? (
                                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {transaction.project}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>{transaction.partner}</span>
                                            <span>•</span>
                                            <span>
                                                {getMethodText(
                                                    transaction.method,
                                                )}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {new Date(
                                                    transaction.date,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`text-lg font-medium ${
                                                transaction.type === "payment"
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {transaction.type === "payment"
                                                ? "-"
                                                : "+"}
                                            R${" "}
                                            {transaction.amount.toLocaleString()}
                                        </span>
                                        <Badge
                                            className={getStatusColor(
                                                transaction.status,
                                            )}
                                        >
                                            {getStatusText(transaction.status)}
                                        </Badge>
                                    </div>
                                    {transaction.fee > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Taxa: R${" "}
                                            {transaction.fee.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                Nenhuma transação encontrada.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Payments;
