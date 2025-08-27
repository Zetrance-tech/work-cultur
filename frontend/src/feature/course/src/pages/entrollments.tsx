
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
//import {api,constant_Data} from '@/services/api'

const accountTypeColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  employee: "bg-green-100 text-green-800 border-green-200",
  user: "bg-gray-100 text-gray-800 border-gray-200",
};

const accountStatusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  suspended: "bg-orange-100 text-orange-800 border-orange-200",
};

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid Date";
  }
}


import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Users, Filter, Download, UserPlus, AlertCircle, RefreshCw } from "lucide-react";



const fetchUsers = async (authToken) => {
  console.log("fetching data at enrolment--->")
  const response = await fetch(api.FETCH_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      organizationId: constant_Data.orgId
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data.data.users;
};

export default function AdminEnrollmentsPage({ 
  authToken, 
  setAuthToken, 
  setIsAuthenticated,
  prefetchedUsers = null,
  prefetchError = null,
  isPrefetching = false
}) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationName, setOrganizationName] = useState("");

  // Transform raw API data to component format
  const transformUsers = (userData) => {
    return userData.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.employeeData?.department?.name || "N/A",
      jobTitle: user.jobTitle,
      accountStatus: user.accountStatus,
      accountType: user.accountType,
      createdAt: user.createdAt,
      organizationName: user.employeeData?.organization?.name || "",
      avatar: null,
    }));
  };

  // Fetch users from API (fallback when no prefetched data)
  const loadUsers = async (forceRefresh = false) => {
    if (!authToken) {
      setError("No authentication token available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await fetchUsers(authToken);
      const transformedUsers = transformUsers(userData);
      
      setUsers(transformedUsers);
      
      // Set organization name from first user
      if (transformedUsers.length > 0 && transformedUsers[0].organizationName) {
        setOrganizationName(transformedUsers[0].organizationName);
      }

         if (prefetchedUsers?.length > 0 && prefetchedUsers[0]?.organizationName) {
        setOrganizationName(prefetchedUsers[0]?.organizationName);
      }
      
      console.log(forceRefresh ? '🔄 Users refreshed' : '📥 Users loaded from API');
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      
      // Handle authentication errors
      if (err.message.includes("Unauthorized")) {
        setAuthToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use prefetched data if available, otherwise fetch from API
  useEffect(() => {
    if (prefetchedUsers && prefetchedUsers.length > 0) {
      // Use prefetched data
      setUsers(prefetchedUsers);
      setIsLoading(false);
      setError(prefetchError);
      
      // Set organization name from prefetched data
      if (prefetchedUsers[0].organizationName) {
        setOrganizationName(prefetchedUsers[0].organizationName);
      }
      
      console.log('⚡ Using prefetched users:', prefetchedUsers.length, 'users');
      
    } else if (prefetchError) {
      // Prefetch failed, try to load fresh data
      setError(prefetchError);
      loadUsers();
      
    } else if (isPrefetching) {
      // Still prefetching, show loading state
      setIsLoading(true);
      
    } else {
      // No prefetched data available, load fresh
      loadUsers();
    }
  }, [prefetchedUsers, prefetchError, isPrefetching, authToken]);

  // Filter users based on search term and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.accountStatus === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((user) => user.accountType === typeFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, typeFilter]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStats = () => {
    const total = users?.length;
    const active = users.filter((u) => u.accountStatus === "active").length;
    const inactive = users.filter((u) => u.accountStatus === "inactive").length;
    const pending = users.filter((u) => u.accountStatus === "pending").length;

    return { total, active, inactive, pending };
  };

  const stats = getStats();

  const handleRefresh = () => {
    loadUsers(true); // Force refresh from API
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Department", "Job Title", "Account Type", "Status", "Created Date"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(user => 
        [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.department}"`,
          `"${user.jobTitle}"`,
          `"${user.accountType}"`,
          `"${user.accountStatus}"`,
          `"${formatDate(user.createdAt)}"`
        ].join(",")
      )
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `users_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show loading state
  const isActuallyLoading = isLoading || isPrefetching;

  if (error && !users.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              User Enrollments
            </h1>
            <p className="text-gray-600">
              {organizationName && `${organizationName} - `}
              Manage user accounts and monitor enrollment status
              {prefetchedUsers && " (⚡ Fast loaded)"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleRefresh}
              disabled={isActuallyLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isActuallyLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleExport}
              disabled={filteredUsers.length === 0}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && users.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Warning: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {isActuallyLoading ? "..." : stats.total}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {isActuallyLoading ? "..." : stats.active}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inactive
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isActuallyLoading ? "..." : stats.inactive}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isActuallyLoading ? "..." : stats.pending}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the component remains the same... */}
        {/* Filters and Search */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">User Directory</CardTitle>
            <CardDescription>
              Search and filter users by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, department, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={isActuallyLoading}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isActuallyLoading}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter} disabled={isActuallyLoading}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Job Title</TableHead>
                  <TableHead className="font-semibold">Account Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Enrolled Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isActuallyLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {isPrefetching ? "Loading users..." : "Loading users..."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {users.length === 0 
                        ? "No users found in your organization" 
                        : "No users found matching your criteria"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-700">{user.department}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{user.jobTitle}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${
                            accountTypeColors[user.accountType] || 
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${
                            accountStatusColors[user.accountStatus] || 
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!isActuallyLoading && filteredUsers.length > 0 && (
          <div className="text-sm text-gray-500 text-center">
            Showing {filteredUsers.length} of {users.length} users
            {prefetchedUsers && " (⚡ Instant load)"}
          </div>
        )}
      </div>
    </div>
  );
}
