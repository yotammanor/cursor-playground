import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getUsers } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: users = [], isLoading, error } = useQuery('users', getUsers)

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button asChild>
          <Link to="/users/new">Add User</Link>
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Loading users...</div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link key={user.id} to={`/users/${user.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle>{user.username}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="mt-2 flex items-center">
                      <span className={`mr-2 h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm">{user.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No users found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Users 