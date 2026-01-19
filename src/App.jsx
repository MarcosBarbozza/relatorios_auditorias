import React, { useState, useEffect } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { db } from './firebase'; // Importa a conexão
import { collection, getDocs } from 'firebase/firestore';

// Importa o modelo Word (que está na pasta src)
import modeloUrl from './modelo_final.docx?url'; 

export default function App() {
  const [listaRequisitos, setListaRequisitos] = useState([]);
  const [requisitoSelecionado, setRequisitoSelecionado] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);

  // --- BUSCAR DADOS DO FIREBASE ---
  useEffect(() => {
    const buscarModelos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "modelos_requisitos"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setListaRequisitos(lista);
        
        // Seleciona o primeiro automaticamente se houver
        if (lista.length > 0) {
          setRequisitoSelecionado(lista[0]);
        }
      } catch (erro) {
        alert("Erro ao buscar no Firebase: " + erro.message);
      } finally {
        setLoading(false);
      }
    };

    buscarModelos();
  }, []);

  const handleChange = (chave, valor) => {
    setRespostas((prev) => ({
      ...prev,
      [chave]: valor,
    }));
  };

  const gerarWord = async () => {
    if (!requisitoSelecionado) return;

    try {
      const response = await fetch(modeloUrl);
      if (!response.ok) throw new Error("Erro ao baixar modelo Word");
      const content = await response.arrayBuffer();

      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '[[', end: ']]' }, // Mantivemos os colchetes!
      });

      // Formata datas
      const dadosFormatados = { ...respostas };
      Object.keys(dadosFormatados).forEach(chave => {
         if (typeof dadosFormatados[chave] === 'string' && dadosFormatados[chave].match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [ano, mes, dia] = dadosFormatados[chave].split('-');
          dadosFormatados[chave] = `${dia}/${mes}/${ano}`;
        }
      });

      // INJETAMOS O TEXTO TEMPLATE QUE VEIO DO BANCO
      // Aqui está o segredo: O template_texto do banco vira uma variável no Word também?
      // NÃO! O Word já tem as variáveis [[proc_docs]].
      // O texto do banco serve para visualização ou se você quiser gerar o texto inteiro dinamicamente.
      
      // Se a sua intenção é que o App PREENCHA o Word com as respostas, a lógica continua igual.
      doc.render(dadosFormatados);

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, `Relatorio_${requisitoSelecionado.titulo}.docx`);
      
    } catch (error) {
       alert("Erro: " + error.message);
    }
  };

  if (loading) return <p>Carregando modelos do banco...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Relatório de Auditorias (Firebase)</h1>

      {/* Seletor de Requisitos (Caso tenha mais de um) */}
      <div style={{ marginBottom: '20px' }}>
        <label>Escolha o Requisito: </label>
        <select 
          onChange={(e) => {
            const req = listaRequisitos.find(r => r.id === e.target.value);
            setRequisitoSelecionado(req);
            setRespostas({}); // Limpa respostas ao trocar
          }}
        >
          {listaRequisitos.map(req => (
            <option key={req.id} value={req.id}>{req.titulo}</option>
          ))}
        </select>
      </div>
      
      {requisitoSelecionado && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>{requisitoSelecionado.titulo}</h2>
          
          {/* Loop pelos campos que vieram do Firebase */}
          {requisitoSelecionado.campos && requisitoSelecionado.campos.map((campo) => (
            <div key={campo.chave} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>
                {campo.pergunta}
              </label>
              <input
                type={campo.tipo}
                style={{ width: '100%', padding: '8px' }}
                onChange={(e) => handleChange(campo.chave, e.target.value)}
              />
            </div>
          ))}

          <button 
            onClick={gerarWord}
            style={{ padding: '12px 24px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '10px'}}
          >
            📄 Baixar Relatório
          </button>
        </div>
      )}
    </div>
  );
}