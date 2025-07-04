
const products = [
  {
    year: '1976',
    title: 'Apple I',
    description: 'The first computer made by Apple, hand-built by Steve Wozniak.',
  },
  {
    year: '1984',
    title: 'Macintosh',
    description: 'The first commercially successful personal computer to feature a mouse and a graphical user interface.',
  },
  {
    year: '1997',
    title: 'Think Different',
    description: 'An iconic advertising slogan which was used in a famous ad campaign for Apple Inc.',
  },
  {
    year: '1998',
    title: 'iMac G3',
    description: 'A series of personal computers that revitalized the Apple brand with its colorful and translucent plastic case.',
  },
  {
    year: '2001',
    title: 'iPod',
    description: 'A portable media player that revolutionized the music industry.',
  },
  {
    year: '2007',
    title: 'iPhone',
    description: 'A smartphone that combined a mobile phone, a widescreen iPod with touch controls, and a breakthrough Internet communications device.',
  },
  {
    year: '2010',
    title: 'iPad',
    description: 'A line of tablet computers that defined a new category of device between the smartphone and the laptop.',
  },
  {
    year: '2015',
    title: 'Apple Watch',
    description: 'A smartwatch that integrates fitness tracking and health-oriented capabilities with iOS and other Apple products and services.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16 font-headline tracking-tight">
          Apple Archive
        </h1>
        <div className="border-t border-border">
          {products.map((product, index) => (
            <div
              key={index}
              className="group transition-colors duration-200 ease-in-out hover:bg-accent border-b border-border cursor-pointer"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 items-center">
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">{product.year}</p>
                  </div>
                  <div className="md:col-span-4">
                    <h2 className="font-semibold text-foreground">{product.title}</h2>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
