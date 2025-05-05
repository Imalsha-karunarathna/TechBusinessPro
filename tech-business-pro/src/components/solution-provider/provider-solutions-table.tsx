'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddSolutionForm } from './add-solution-form';

// Mock data for solutions
const mockSolutions = [
  {
    id: 1,
    title: 'Cloud Migration Platform',
    category: 'cloud_computing',
    status: 'active',
    views: 245,
    inquiries: 12,
    created_at: '2023-09-15',
  },
  {
    id: 2,
    title: 'AI-Powered Customer Service',
    category: 'artificial_intelligence',
    status: 'active',
    views: 189,
    inquiries: 8,
    created_at: '2023-10-02',
  },
  {
    id: 3,
    title: 'Secure Payment Gateway',
    category: 'cybersecurity',
    status: 'pending',
    views: 0,
    inquiries: 0,
    created_at: '2023-10-20',
  },
];

// Category mapping
const categoryMap: Record<string, string> = {
  cloud_computing: 'Cloud Computing',
  artificial_intelligence: 'Artificial Intelligence',
  cybersecurity: 'Cybersecurity',
  data_analytics: 'Data Analytics',
  iot: 'Internet of Things',
  blockchain: 'Blockchain',
  erp: 'ERP Systems',
  crm: 'CRM Solutions',
};

export function ProviderSolutionsTable() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Solutions</h2>
          <p className="text-muted-foreground">
            Manage your technology solutions and track their performance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Solution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-amber-50">
            <DialogTitle>Add New Solution</DialogTitle>
            <DialogDescription>
              Create a new technology solution to showcase to potential clients
            </DialogDescription>

            <AddSolutionForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solutions</CardTitle>
          <CardDescription>
            View and manage all your technology solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solution</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Inquiries</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSolutions.map((solution) => (
                <TableRow key={solution.id}>
                  <TableCell className="font-medium">
                    {solution.title}
                  </TableCell>
                  <TableCell>
                    {categoryMap[solution.category] || solution.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        solution.status === 'active' ? 'default' : 'secondary'
                      }
                      className={
                        solution.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      }
                    >
                      {solution.status === 'active' ? 'Active' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{solution.views}</TableCell>
                  <TableCell className="text-right">
                    {solution.inquiries}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
