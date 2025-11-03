import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 md:px-10 py-20 md:py-32">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">Klinik Palu</h1>
              <p className="text-xl md:text-2xl text-primary font-semibold">Layanan Kesehatan Terpercaya untuk Anda</p>
              <p className="text-lg text-muted-foreground text-balance">
                Kami menyediakan layanan kesehatan berkualitas tinggi dengan dokter berpengalaman dan fasilitas modern.
                Komitmen kami adalah memberikan perawatan terbaik untuk kesehatan Anda dan keluarga.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Masuk
                </Button>
              </Link>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jam Operasional</p>
                <p className="font-semibold">Senin - Jumat: 08:00 - 17:00</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-semibold">Jl. Kesehatan No. 123, Palu</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full rounded-lg overflow-hidden bg-muted">
            <Image src="/modern-clinic-interior-with-medical-equipment.jpg" alt="Klinik Palu" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full px-6 md:px-10 py-20 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Layanan Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berbagai layanan kesehatan profesional untuk memenuhi kebutuhan Anda
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Service 1 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">🏥</div>
                <CardTitle>Pemeriksaan Umum</CardTitle>
                <CardDescription>
                  Konsultasi dengan dokter umum berpengalaman untuk pemeriksaan kesehatan rutin
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Service 2 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">💉</div>
                <CardTitle>Vaksinasi</CardTitle>
                <CardDescription>
                  Program vaksinasi lengkap untuk anak-anak dan dewasa dengan vaksin berkualitas
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Service 3 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">🩺</div>
                <CardTitle>Pemeriksaan Laboratorium</CardTitle>
                <CardDescription>Tes darah dan pemeriksaan laboratorium dengan hasil akurat dan cepat</CardDescription>
              </CardHeader>
            </Card>

            {/* Service 4 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">🦷</div>
                <CardTitle>Perawatan Gigi</CardTitle>
                <CardDescription>
                  Layanan kesehatan gigi lengkap dari pembersihan hingga perawatan khusus
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Service 5 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">👶</div>
                <CardTitle>Kesehatan Ibu & Anak</CardTitle>
                <CardDescription>
                  Pemeriksaan kehamilan, persalinan, dan perawatan bayi dengan tim profesional
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Service 6 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">🩹</div>
                <CardTitle>Perawatan Luka</CardTitle>
                <CardDescription>Penanganan luka, penjahitan, dan perawatan medis darurat</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="w-full px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Mengapa Memilih Klinik Palu?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan pelayanan kesehatan terbaik dengan standar internasional
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Reason 1 */}
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dokter Berpengalaman</h3>
                  <p className="text-muted-foreground">Tim dokter spesialis dengan pengalaman lebih dari 10 tahun</p>
                </div>
              </div>
            </div>

            {/* Reason 2 */}
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Fasilitas Modern</h3>
                  <p className="text-muted-foreground">Peralatan medis terkini dan teknologi kesehatan terdepan</p>
                </div>
              </div>
            </div>

            {/* Reason 3 */}
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Harga Terjangkau</h3>
                  <p className="text-muted-foreground">Paket layanan dengan harga kompetitif dan terjangkau</p>
                </div>
              </div>
            </div>

            {/* Reason 4 */}
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Layanan 24 Jam</h3>
                  <p className="text-muted-foreground">Siap melayani Anda kapan saja untuk kebutuhan darurat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="w-full px-6 md:px-10 py-20 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Paket Layanan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan kesehatan Anda
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic Package */}
            <Card>
              <CardHeader>
                <CardTitle>Paket Dasar</CardTitle>
                <CardDescription>Untuk pemeriksaan rutin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold">Rp150.000</div>
                  <p className="text-sm text-muted-foreground">per kunjungan</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Konsultasi dokter umum
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Pemeriksaan fisik lengkap
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Resep obat
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Daftar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Package */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Paket Premium</CardTitle>
                <CardDescription>Paling populer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold">Rp350.000</div>
                  <p className="text-sm text-muted-foreground">per kunjungan</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Konsultasi dokter spesialis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Pemeriksaan laboratorium
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Resep obat lengkap
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Konsultasi follow-up gratis
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="w-full">
                  <Button className="w-full">Daftar Sekarang</Button>
                </Link>
              </CardContent>
            </Card>

            {/* VIP Package */}
            <Card>
              <CardHeader>
                <CardTitle>Paket VIP</CardTitle>
                <CardDescription>Untuk perawatan komprehensif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold">Rp750.000</div>
                  <p className="text-sm text-muted-foreground">per bulan</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Kunjungan unlimited
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Dokter spesialis prioritas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Pemeriksaan lab gratis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Konsultasi 24/7
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Hubungi Kami
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Testimoni Pasien</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kepuasan pasien adalah prioritas utama kami
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Pelayanan di Klinik Palu sangat memuaskan. Dokternya ramah dan profesional. Saya sangat
                  merekomendasikan klinik ini."
                </p>
                <div>
                  <p className="font-semibold">Budi Santoso</p>
                  <p className="text-sm text-muted-foreground">Pasien Setia</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Fasilitas modern dan dokter yang berpengalaman. Harga juga sangat terjangkau. Terima kasih Klinik
                  Palu!"
                </p>
                <div>
                  <p className="font-semibold">Siti Nurhaliza</p>
                  <p className="text-sm text-muted-foreground">Pasien Baru</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Pelayanan 24 jam sangat membantu saat saya membutuhkan bantuan medis darurat. Staf yang responsif dan
                  cepat."
                </p>
                <div>
                  <p className="font-semibold">Ahmad Wijaya</p>
                  <p className="text-sm text-muted-foreground">Pasien Darurat</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full px-6 md:px-10 py-20 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Hubungi Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kami siap membantu Anda dengan pertanyaan atau kebutuhan kesehatan
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Contact Info 1 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">📍</div>
                <CardTitle>Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Jl. Kesehatan No. 123
                  <br />
                  Palu, Sulawesi Tengah 94111
                </p>
              </CardContent>
            </Card>

            {/* Contact Info 2 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">📞</div>
                <CardTitle>Telepon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  (0451) 123-4567
                  <br />
                  WhatsApp: 0812-3456-7890
                </p>
              </CardContent>
            </Card>

            {/* Contact Info 3 */}
            <Card>
              <CardHeader>
                <div className="text-3xl mb-2">⏰</div>
                <CardTitle>Jam Operasional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Senin - Jumat: 08:00 - 17:00
                  <br />
                  Sabtu: 08:00 - 13:00
                  <br />
                  Minggu & Libur: Tutup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Siap untuk Kesehatan yang Lebih Baik?</h2>
            <p className="text-lg text-muted-foreground">
              Daftarkan diri Anda sekarang dan nikmati layanan kesehatan terbaik dari Klinik Palu
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/30 px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Klinik Palu</h3>
              <p className="text-sm text-muted-foreground">
                Layanan kesehatan terpercaya dengan dokter berpengalaman dan fasilitas modern untuk kesehatan Anda.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Layanan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#services" className="hover:text-foreground">
                    Layanan Kami
                  </Link>
                </li>
                <li>
                  <Link href="#packages" className="hover:text-foreground">
                    Paket Layanan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Jadwal Dokter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="hover:text-foreground">
                    Testimoni
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground">
                    Hubungi Kami
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Informasi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Klinik Palu. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
