import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useKalkulacije } from '@/hooks/useKalkulacije';
import { useTransport } from '@/hooks/useTransport';
import { useElementi } from '@/hooks/useElementi';
import { ArrowLeft, ArrowRight, Loader2, Save, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function KalkulacijaTransport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kalkulacije, loading: kalkulacijeLoading } = useKalkulacije();
  const { gTura, vgTura, ukupnoTransport, loading, upsertTransport, calculateTransportCosts } = useTransport(id);
  const { ukupnoElementi } = useElementi(id);

  const kalkulacija = kalkulacije.find(k => k.id === id);

  const [gData, setGData] = useState({
    udaljenost_km: 0,
    cijena_po_m3: 0,
    broj_tura: 0,
    ukupna_cijena_km: 0,
  });

  const [vgData, setVgData] = useState({
    udaljenost_km: 0,
    cijena_po_m3: 0,
    broj_tura: 0,
    ukupna_cijena_km: 0,
  });

  useEffect(() => {
    if (kalkulacija) {
      const costs = calculateTransportCosts(kalkulacija.udaljenost_km || 0, ukupnoElementi.beton_m3);
      
      setGData(gTura ? {
        udaljenost_km: gTura.udaljenost_km,
        cijena_po_m3: gTura.cijena_po_m3,
        broj_tura: gTura.broj_tura,
        ukupna_cijena_km: gTura.ukupna_cijena_km,
      } : costs.g);

      setVgData(vgTura ? {
        udaljenost_km: vgTura.udaljenost_km,
        cijena_po_m3: vgTura.cijena_po_m3,
        broj_tura: vgTura.broj_tura,
        ukupna_cijena_km: vgTura.ukupna_cijena_km,
      } : costs.vg);
    }
  }, [kalkulacija, gTura, vgTura, ukupnoElementi.beton_m3]);

  const handleGChange = (field: string, value: number) => {
    setGData(prev => {
      const updated = { ...prev, [field]: value };
      updated.ukupna_cijena_km = updated.cijena_po_m3 * updated.broj_tura;
      return updated;
    });
  };

  const handleVgChange = (field: string, value: number) => {
    setVgData(prev => {
      const updated = { ...prev, [field]: value };
      updated.ukupna_cijena_km = updated.cijena_po_m3 * updated.broj_tura;
      return updated;
    });
  };

  const handleSave = async () => {
    await upsertTransport('G', gData);
    await upsertTransport('VG', vgData);
    toast.success('Transport sačuvan');
  };

  const handleRecalculate = () => {
    if (kalkulacija) {
      const costs = calculateTransportCosts(kalkulacija.udaljenost_km || 0, ukupnoElementi.beton_m3);
      setGData(costs.g);
      setVgData(costs.vg);
      toast.info('Troškovi transporta ponovo izračunati');
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
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Troškovi transporta</h1>
            <p className="text-muted-foreground mt-1">
              {kalkulacija.objekat} - {kalkulacija.mjesto_gradnje} ({kalkulacija.udaljenost_km} km)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRecalculate}>
              Ponovo izračunaj
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sačuvaj
            </Button>
          </div>
        </div>

        {/* Info kartica */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Udaljenost</p>
                <p className="text-2xl font-bold text-primary">{kalkulacija.udaljenost_km} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ukupno betona</p>
                <p className="text-2xl font-bold text-primary">{ukupnoElementi.beton_m3.toFixed(2)} m³</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Udaljenost x 2</p>
                <p className="text-2xl font-bold">{(kalkulacija.udaljenost_km || 0) * 2} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ukupno transport</p>
                <p className="text-2xl font-bold text-primary">
                  {(gData.ukupna_cijena_km + vgData.ukupna_cijena_km).toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* G Tura */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-primary">G TURA (Gabaritna)</CardTitle>
                <CardDescription>Transport gabaritnih elemenata</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Udaljenost (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={gData.udaljenost_km}
                  onChange={(e) => handleGChange('udaljenost_km', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cijena po m³ (KM)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={gData.cijena_po_m3}
                  onChange={(e) => handleGChange('cijena_po_m3', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Broj tura</Label>
                <Input
                  type="number"
                  min="0"
                  value={gData.broj_tura}
                  onChange={(e) => handleGChange('broj_tura', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ukupno (KM)</Label>
                <div className="h-10 px-3 py-2 rounded-md border bg-muted font-semibold text-primary text-lg">
                  {gData.ukupna_cijena_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VG Tura */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-primary">VG TURA (Vangabaritna)</CardTitle>
                <CardDescription>Transport vangabaritnih elemenata</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Udaljenost (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={vgData.udaljenost_km}
                  onChange={(e) => handleVgChange('udaljenost_km', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cijena po m³ (KM)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={vgData.cijena_po_m3}
                  onChange={(e) => handleVgChange('cijena_po_m3', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Broj tura</Label>
                <Input
                  type="number"
                  min="0"
                  value={vgData.broj_tura}
                  onChange={(e) => handleVgChange('broj_tura', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ukupno (KM)</Label>
                <div className="h-10 px-3 py-2 rounded-md border bg-muted font-semibold text-primary text-lg">
                  {vgData.ukupna_cijena_km.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigacija */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(`/kalkulacija/${id}/elementi`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Elementi
          </Button>
          <Button onClick={() => navigate(`/kalkulacija/${id}`)}>
            Pregled kalkulacije
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
