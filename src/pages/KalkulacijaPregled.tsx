import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKalkulacije } from '@/hooks/useKalkulacije';
import { ArrowLeft, Edit, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { bs } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import baupartnerLogo from '@/assets/baupartner-logo.gif';

export default function KalkulacijaPregled() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kalkulacije, loading } = useKalkulacije();
  
  const kalkulacija = kalkulacije.find(k => k.id === id);

  if (loading) {
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

  const handlePrint = () => window.print();

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto print:max-w-none">
        <div className="flex items-center justify-between print:hidden">
          <Button variant="outline" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Nazad</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/kalkulacija/${id}/edit`)}><Edit className="h-4 w-4 mr-2" />Uredi</Button>
            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Štampaj</Button>
          </div>
        </div>

        {/* Ponuda Header */}
        <Card className="print:shadow-none print:border-none">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <img src={baupartnerLogo} alt="Baupartner" className="h-16" />
              <div className="text-right">
                <h1 className="text-2xl font-bold text-primary">PONUDA</h1>
                <p className="text-muted-foreground">Datum: {format(new Date(kalkulacija.datum_kalkulacije), 'dd.MM.yyyy', { locale: bs })}</p>
                <p className="text-muted-foreground">Verzija: {kalkulacija.verzija}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5"><CardTitle className="text-primary">Osnovni podaci o objektu</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Objekat</p><p className="font-medium">{kalkulacija.objekat}</p></div>
              <div><p className="text-sm text-muted-foreground">Mjesto gradnje</p><p className="font-medium">{kalkulacija.mjesto_gradnje}</p></div>
              <div><p className="text-sm text-muted-foreground">Država</p><p className="font-medium">{kalkulacija.drzava}</p></div>
              <div><p className="text-sm text-muted-foreground">Udaljenost</p><p className="font-medium">{kalkulacija.udaljenost_km} km</p></div>
              <div><p className="text-sm text-muted-foreground">Površina objekta</p><p className="font-medium">{kalkulacija.povrsina_objekta_m2} m²</p></div>
              <div><p className="text-sm text-muted-foreground">Tlocrt objekta</p><p className="font-medium">{kalkulacija.tlocrt_objekta_m2} m²</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5"><CardTitle className="text-primary">Troškovi inostranstvo</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Broj radnika</p><p className="font-medium">{kalkulacija.ino_broj_radnika}</p></div>
              <div><p className="text-sm text-muted-foreground">Broj dana</p><p className="font-medium">{kalkulacija.ino_broj_dana}</p></div>
              <div><p className="text-sm text-muted-foreground">Ukupno</p><p className="font-medium text-primary">{kalkulacija.ino_ukupno_km?.toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5"><CardTitle className="text-primary">Troškovi BiH</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Broj radnika</p><p className="font-medium">{kalkulacija.bih_broj_radnika}</p></div>
              <div><p className="text-sm text-muted-foreground">Broj dana</p><p className="font-medium">{kalkulacija.bih_broj_dana}</p></div>
              <div><p className="text-sm text-muted-foreground">Ukupno</p><p className="font-medium text-primary">{kalkulacija.bih_ukupno_km?.toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          © {new Date().getFullYear()} Baupartner d.o.o.
        </div>
      </div>
    </Layout>
  );
}
