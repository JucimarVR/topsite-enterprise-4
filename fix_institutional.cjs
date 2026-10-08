const fs = require('fs');

let content = fs.readFileSync('src/components/Institutional.tsx', 'utf8');

// Títulos Educação
content = content.replace(
  /<h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Educação: Tesouro Direto<\/h3>/g,
  '<h3 className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">Educação: Tesouro Direto</h3>'
);
content = content.replace(
  /<h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Educação: Mercado de Commodities<\/h3>/g,
  '<h3 className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">Educação: Mercado de Commodities</h3>'
);

// Trajetória
content = content.replace(
  /Trajetória de <span className="text-brand-gold">Solidez e Crescimento<\/span>/g,
  '<span className="text-blue-600 dark:text-blue-400">Trajetória de Solidez e Crescimento</span>'
);

// Mesa
content = content.replace(
  /Membros da Mesa de <span className="text-brand-gold">Especialistas<\/span>/g,
  '<span className="text-blue-600 dark:text-blue-400">Mesa de Especialistas</span>'
);

// Missão, Visão, Valores - they are defined in an array:
/*
    {
      title: "Missão",
      icon: Compass,
      desc: "..."
    }
    
    Rendered as:
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{value.title}</h3>
*/
content = content.replace(
  /<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{value.title}<\/h3>/g,
  '<h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{value.title}</h3>'
);

fs.writeFileSync('src/components/Institutional.tsx', content, 'utf8');
