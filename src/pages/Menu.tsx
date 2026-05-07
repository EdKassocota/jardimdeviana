import { useState } from 'react';

const menuData = {
  entradas: [
    { name: "Carpaccio de Novilho", desc: "Lâminas finas de novilho, parmesão, rúcula e azeite trufado", price: "8.500 Kz" },
    { name: "Tártaro de Atum", desc: "Atum fresco, abacate, sésamo e soja cítrica", price: "12.000 Kz" },
    { name: "Burrata Cremosa", desc: "Pesto de manjericão, tomate cereja confitado e pinhões", price: "9.500 Kz" },
  ],
  pratos: [
    { name: "Polvo à Lagareiro", desc: "Polvo assado, batata a murro, alho e azeite virgem extra", price: "24.000 Kz" },
    { name: "Bife Wellington", desc: "Lombo de novilho envolto em massa folhada e duxelles de cogumelos", price: "35.000 Kz" },
    { name: "Risotto de Cogumelos Selvagens", desc: "Arroz carnaroli, cogumelos frescos, parmesão e azeite de trufa", price: "18.500 Kz" },
    { name: "Lombo de Bacalhau Fresco", desc: "Bacalhau, puré de grão, espargos e emulsão de coentros", price: "26.000 Kz" },
  ],
  sobremesas: [
    { name: "Mousse de Chocolate Negro", desc: "Com flor de sal e azeite virgem extra", price: "5.500 Kz" },
    { name: "Crumble de Maçã", desc: "Maçã caramelizada, canela e gelado de baunilha de Madagáscar", price: "6.000 Kz" },
    { name: "Cheesecake Desconstruído", desc: "Creme de queijo, crumble de amêndoa e coulis de frutos vermelhos", price: "6.500 Kz" },
  ],
  bebidas: [
    { name: "Água Mineral 0.75L", price: "1.500 Kz" },
    { name: "Refrigerantes", price: "1.500 Kz" },
    { name: "Gin Tonic Premium", desc: "Gin Hendrick's, tónica Fever-Tree, pepino e pimenta rosa", price: "8.500 Kz" },
    { name: "Vinho Tinto Reserva DOC", desc: "Garrafa - Douro", price: "45.000 Kz" },
  ]
};

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof menuData>('entradas');

  const categories = [
    { id: 'entradas', label: 'Entradas' },
    { id: 'pratos', label: 'Pratos Principais' },
    { id: 'sobremesas', label: 'Sobremesas' },
    { id: 'bebidas', label: 'Bebidas' },
  ] as const;

  return (
    <div className="w-full min-h-screen pt-32 pb-20 px-6 md:px-10 flex flex-col items-center">
      <div className="flex flex-col text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted mb-4">A Nossa Seleção</span>
        <h1 className="font-display text-5xl md:text-6xl font-light">
          O <span className="italic font-serif text-brand-orange">Menu</span>
        </h1>
      </div>

      <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 border-b border-white/10 pb-6 w-full max-w-3xl border-t pt-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-2 relative ${
              activeCategory === cat.id ? 'text-brand-orange' : 'text-muted hover:text-white'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <span className="absolute -bottom-[25px] left-0 right-0 h-[1px] bg-brand-orange" />
            )}
          </button>
        ))}
      </nav>

      <div className="w-full max-w-3xl flex flex-col gap-10">
        {menuData[activeCategory].map((item, idx) => (
          <div key={idx} className="flex gap-4 border-b border-subtle pb-8 group">
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-display text-xl text-white group-hover:text-brand-orange transition-colors">{item.name}</h3>
              {item.desc && <p className="text-sm text-muted">{item.desc}</p>}
            </div>
            <div className="text-brand-orange font-mono tracking-tighter text-lg whitespace-nowrap">
              {item.price}
            </div>
          </div>
        ))}
      </div>
      
      <footer className="pt-20 opacity-40 text-[9px] uppercase tracking-widest text-center">
        <span>© 2026 Jardim de Viana</span>
      </footer>
    </div>
  );
}
