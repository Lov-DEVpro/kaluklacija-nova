import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useKalkulacije } from '@/hooks/useKalkulacije';
import { Plus, Copy, Trash2, Edit, Eye, Search, FileText, Loader2, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { bs } from 'date-fns/locale';

export default function Index() {
  const navigate = useNavigate();
  const { kalkulacije, loading, deleteKalkulacija, duplicateKalkulacija } = useKalkulacije();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrzava, setFilterDrzava] = useState<string>('all');
  const [filterPonuda, setFilterPonuda] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredKalkulacije = kalkulacije
    .filter(k => {
      const matchesSearch = 
        k.objekat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.mjesto_gradnje.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.verzija.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDrzava = filterDrzava === 'all' || k.drzava === filterDrzava;
      const matchesPonuda = filterPonuda === 'all' || k.ponuda === filterPonuda;
      return matchesSearch && matchesDrzava && matchesPonuda;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteKalkulacija(deleteId);
      setDeleteId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    const newKalkulacija = await duplicateKalkulacija(id);
    if (newKalkulacija) {
      navigate(`/kalkulacija/${newKalkulacija.id}/edit`);
    }
  };

  const uniqueDrzave = [...new Set(kalkulacije.map(k => k.drzava))];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-primary">Kalkulacije montažnih konstrukcija</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Odaberite radnju ili otvorite postojeću kalkulaciju za pregled i uređivanje.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/kalkulacija/nova')} className="gap-2">
            <Plus className="h-5 w-5" />
            Nova kalkulacija
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/kalkulacije')} className="gap-2">
            <FileText className="h-5 w-5" />
            Verzija postojeće kalkulacije
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Prethodne kalkulacije</CardTitle>
            <CardDescription>Pregled svih kalkulacija sa mogućnošću pretrage i filtriranja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Pretraži po objektu, mjestu ili verziji..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterDrzava} onValueChange={setFilterDrzava}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Država" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve države</SelectItem>
                  {uniqueDrzave.map(drzava => (<SelectItem key={drzava} value={drzava}>{drzava}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={filterPonuda} onValueChange={setFilterPonuda}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Ponuda" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve</SelectItem>
                  <SelectItem value="DA">Ponuda: DA</SelectItem>
                  <SelectItem value="NE">Ponuda: NE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredKalkulacije.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {kalkulacije.length === 0 ? 'Nemate još nijednu kalkulaciju. Kreirajte novu klikom na tipku iznad.' : 'Nema rezultata za zadane filtere.'}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('datum_kalkulacije')}>Datum</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('verzija')}>Verzija</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('drzava')}>Država</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('objekat')}>Objekat</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('mjesto_gradnje')}>Mjesto gradnje</TableHead>
                      <TableHead>Ponuda</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKalkulacije.map((kalkulacija) => (
                      <TableRow key={kalkulacija.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/kalkulacija/${kalkulacija.id}`)}>
                        <TableCell>{format(new Date(kalkulacija.datum_kalkulacije), 'dd.MM.yyyy', { locale: bs })}</TableCell>
                        <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{kalkulacija.verzija}</span></TableCell>
                        <TableCell>{kalkulacija.drzava}</TableCell>
                        <TableCell className="font-medium">{kalkulacija.objekat}</TableCell>
                        <TableCell>{kalkulacija.mjesto_gradnje}</TableCell>
                        <TableCell><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${kalkulacija.ponuda === 'DA' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{kalkulacija.ponuda}</span></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/kalkulacija/${kalkulacija.id}`)} title="Pregled"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/kalkulacija/${kalkulacija.id}/edit`)} title="Uredi"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDuplicate(kalkulacija.id)} title="Dupliciraj"><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(kalkulacija.id)} title="Obriši" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrda brisanja</AlertDialogTitle>
            <AlertDialogDescription>Da li ste sigurni da želite obrisati ovu kalkulaciju? Ova akcija se ne može poništiti.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Obriši</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
