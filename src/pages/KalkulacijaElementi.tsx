import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useKalkulacije } from '@/hooks/useKalkulacije';
import { useElementi } from '@/hooks/useElementi';
import { ELEMENT_CATEGORIES, MARKE_BETONA, ElementKalkulacije } from '@/types/kalkulacija';
import { ArrowLeft, ArrowRight, Plus, Trash2, Edit, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const defaultElement = {
  naziv_elementa: '',
  tip_elementa_id: null,
  dimenzije: '',
  kolicina: 1,
  beton_m3: 0,
  armatura_kg: 0,
  kablovi_kg: 0,
  marka_betona: 'MB40',
  cijena_materijala_km: 0,
  cijena_rada_km: 0,
  ukupna_cijena_km: 0,
};

export default function KalkulacijaElementi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kalkulacije, loading: kalkulacijeLoading } = useKalkulacije();
  const { elementi, tipoviElemenata, ukupnoElementi, loading, createElementi, updateElement, deleteElement } = useElementi(id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<Partial<ElementKalkulacije> | null>(null);
  const [formData, setFormData] = useState(defaultElement);

  const kalkulacija = kalkulacije.find(k => k.id === id);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Automatski izračunaj ukupnu cijenu
      updated.ukupna_cijena_km = updated.cijena_materijala_km + updated.cijena_rada_km;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!formData.naziv_elementa.trim()) {
      toast.error('Naziv elementa je obavezan');
      return;
    }

    if (editingElement?.id) {
      await updateElement(editingElement.id, formData);
    } else {
      await createElementi(formData as Omit<ElementKalkulacije, 'id' | 'created_at'>);
    }
    
    setIsDialogOpen(false);
    setFormData(defaultElement);
    setEditingElement(null);
  };

  const handleEdit = (element: ElementKalkulacije) => {
    setEditingElement(element);
    setFormData({
      naziv_elementa: element.naziv_elementa,
      tip_elementa_id: element.tip_elementa_id,
      dimenzije: element.dimenzije || '',
      kolicina: element.kolicina,
      beton_m3: element.beton_m3,
      armatura_kg: element.armatura_kg,
      kablovi_kg: element.kablovi_kg,
      marka_betona: element.marka_betona,
      cijena_materijala_km: element.cijena_materijala_km,
      cijena_rada_km: element.cijena_rada_km,
      ukupna_cijena_km: element.ukupna_cijena_km,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (elementId: string) => {
    if (confirm('Da li ste sigurni da želite obrisati ovaj element?')) {
      await deleteElement(elementId);
    }
  };

  if (kalkulacijeLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!kalkulacija) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-muted-foreground">Kalkulacija nije pronađena</h2>
          <Button className="mt-4" onClick={() => navigate('/')}>Nazad na početnu</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Elementi konstrukcije</h1>
            <p className="text-muted-foreground mt-1">
              {kalkulacija.objekat} - {kalkulacija.mjesto_gradnje}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setFormData(defaultElement); setEditingElement(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj element
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingElement ? 'Uredi element' : 'Novi element'}</DialogTitle>
                <DialogDescription>Unesite podatke o elementu konstrukcije</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Naziv elementa *</Label>
                    <Input
                      value={formData.naziv_elementa}
                      onChange={(e) => handleChange('naziv_elementa', e.target.value)}
                      placeholder="Npr. Stub S-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tip elementa</Label>
                    <Select
                      value={formData.tip_elementa_id || 'none'}
                      onValueChange={(v) => handleChange('tip_elementa_id', v === 'none' ? '' : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberi tip" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Bez tipa</SelectItem>
                        {tipoviElemenata.map(tip => (
                          <SelectItem key={tip.id} value={tip.id}>{tip.naziv_tipa}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Dimenzije (b/l/h)</Label>
                    <Input
                      value={formData.dimenzije}
                      onChange={(e) => handleChange('dimenzije', e.target.value)}
                      placeholder="70/1250/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Količina (kom)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.kolicina}
                      onChange={(e) => handleChange('kolicina', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marka betona</Label>
                    <Select
                      value={formData.marka_betona}
                      onValueChange={(v) => handleChange('marka_betona', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKE_BETONA.map(mb => (
                          <SelectItem key={mb} value={mb}>{mb}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Beton (m³)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.beton_m3}
                      onChange={(e) => handleChange('beton_m3', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Armatura (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.armatura_kg}
                      onChange={(e) => handleChange('armatura_kg', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kablovi (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.kablovi_kg}
                      onChange={(e) => handleChange('kablovi_kg', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cijena materijala (KM)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cijena_materijala_km}
                      onChange={(e) => handleChange('cijena_materijala_km', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cijena rada (KM)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cijena_rada_km}
                      onChange={(e) => handleChange('cijena_rada_km', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ukupna cijena (KM)</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted font-semibold text-primary">
                      {formData.ukupna_cijena_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Odustani</Button>
                <Button onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingElement ? 'Sačuvaj' : 'Dodaj'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela elemenata */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-primary">Elementi</CardTitle>
            <CardDescription>Lista svih elemenata konstrukcije za ovu kalkulaciju</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {elementi.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nema dodanih elemenata. Kliknite "Dodaj element" za početak.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naziv</TableHead>
                      <TableHead>Dimenzije</TableHead>
                      <TableHead className="text-right">Količina</TableHead>
                      <TableHead className="text-right">Beton (m³)</TableHead>
                      <TableHead className="text-right">Armatura (kg)</TableHead>
                      <TableHead className="text-right">Materijal (KM)</TableHead>
                      <TableHead className="text-right">Rad (KM)</TableHead>
                      <TableHead className="text-right">Ukupno (KM)</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {elementi.map((element) => (
                      <TableRow key={element.id}>
                        <TableCell className="font-medium">{element.naziv_elementa}</TableCell>
                        <TableCell>{element.dimenzije || '-'}</TableCell>
                        <TableCell className="text-right">{element.kolicina}</TableCell>
                        <TableCell className="text-right">{element.beton_m3.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{element.armatura_kg.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{element.cijena_materijala_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">{element.cijena_rada_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right font-semibold">{element.ukupna_cijena_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(element)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(element.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Ukupno red */}
                    <TableRow className="bg-primary/5 font-bold">
                      <TableCell colSpan={3}>UKUPNO</TableCell>
                      <TableCell className="text-right">{ukupnoElementi.beton_m3.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{ukupnoElementi.armatura_kg.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{ukupnoElementi.cijena_materijala_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">{ukupnoElementi.cijena_rada_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right text-primary">{ukupnoElementi.ukupna_cijena_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigacija */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(`/kalkulacija/${id}/edit`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na kalkulaciju
          </Button>
          <Button onClick={() => navigate(`/kalkulacija/${id}/transport`)}>
            Transport
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
