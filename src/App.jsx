import React, { useState } from 'react';

// Estilos simples para substituir os ícones e manter a organização visual
const SectionHeader = ({ title, color }) => (
  <div className={`border-l-4 ${color} pl-4 py-2 mb-4 bg-gray-50 rounded-r`}>
    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
      {title}
    </h2>
  </div>
);

const UniversalAuditGenerator = () => {
  // Configurações Gerais da Auditoria
  const [config, setConfig] = useState({
    empresa: '',
    tipoControle: 'sistema', // sistema | planilha | fisico
    nomeSistema: 'Protheus', 
    nomeDocRecebimento: 'PQ-082', 
    nomeDocProducao: 'PQ-090', 
    nomeDocExpedicao: 'PQ-152', 
    normaReferencia: 'ISO 9001:2015'
  });

  // Dados da Evidência
  const [data, setData] = useState({
    rec_data: '',
    rec_nf: '',
    rec_fornecedor: '',
    rec_material: '',
    rec_lote: '',
    prod_op: '',
    prod_data: '',
    prod_produto: '',
    prod_qtd: '',
    prod_registro: '', 
    exp_doc: '', 
    exp_cliente: '',
    exp_destino: '',
    exp_rastreio: '' 
  });

  const [copied, setCopied] = useState(false);

  const handleConfigChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Lógica Adaptativa
  const getTextVariations = () => {
    if (config.tipoControle === 'sistema') {
      return {
        gerenciamento: `gerenciado via sistema integrado ${config.nomeSistema}`,
        rastreabilidade: `assegurada pelo lançamento no módulo de estoque/produção`,
        evidencia: `registrado digitalmente`,
        etiqueta: `etiqueta gerada pelo sistema`
      };
    } else if (config.tipoControle === 'planilha') {
      return {
        gerenciamento: `gerenciado através de planilhas eletrônicas de controle`,
        rastreabilidade: `monitorada via controle de abas de produção e estoque`,
        evidencia: `registrado na planilha de controle`,
        etiqueta: `identificação impressa/manual`
      };
    } else {
      return {
        gerenciamento: `controlado através de registros físicos e fichas de acompanhamento`,
        rastreabilidade: `garantida através do preenchimento das fichas de processo que acompanham o lote`,
        evidencia: `registrado em formulário físico`,
        etiqueta: `etiqueta/cartão manual`
      };
    }
  };

  const generateReport = () => {
    const text = getTextVariations();

    return `(8.1/8.5.1/8.5.2/8.5.4/8.6) CONTROLE OPERACIONAL E RASTREABILIDADE

A organização demonstra controle sobre seus processos produtivos e de fornecimento externo. O fluxo é ${text.gerenciamento}, conforme diretrizes do ${config.nomeDocRecebimento} e ${config.nomeDocProducao}.

1. RECEBIMENTO E CONTROLE DE MATÉRIA-PRIMA (8.4)
No recebimento, os materiais são conferidos e identificados.
Evidenciado o recebimento da Nota Fiscal ${data.rec_nf || '[NF]'}, datada de ${data.rec_data || '[DATA]'}, do fornecedor ${data.rec_fornecedor || '[FORNECEDOR]'}.
- Material: ${data.rec_material || '[MATERIAL]'}
- Lote de Origem: ${data.rec_lote || '[LOTE]'}
O item foi inspecionado e aprovado, sendo ${text.evidencia} para entrada no estoque.

2. CONTROLE DE PRODUÇÃO (8.5.1)
O processo produtivo é iniciado com base na Ordem de Produção (OP) ou Programação, seguindo as especificações técnicas.
Evidenciada a OP/Lote nº ${data.prod_op || '[OP]'} de ${data.prod_data || '[DATA]'}.
- Produto: ${data.prod_produto || '[PRODUTO]'}
- Quantidade: ${data.prod_qtd || '[QTD]'}
Durante as etapas de fabricação, o controle de qualidade e status do processo são registrados no documento ${data.prod_registro || '[REGISTRO DE PROCESSO]'}, garantindo a rastreabilidade interna.

3. IDENTIFICAÇÃO E RASTREABILIDADE (8.5.2)
Os materiais em processo e produtos acabados são identificados através de ${text.etiqueta}. A rastreabilidade é ${text.rastreabilidade}, permitindo recuperar o histórico desde a matéria-prima utilizada.

4. LIBERAÇÃO E EXPEDIÇÃO (8.6)
Na expedição, realiza-se a conferência final antes do carregamento, conforme ${config.nomeDocExpedicao}.
Evidenciado o documento de saída ${data.exp_doc || '[DOC SAÍDA]'} para o cliente ${data.exp_cliente || '[CLIENTE]'} (${data.exp_destino || '[DESTINO]'}).
A carga foi identificada com ${data.exp_rastreio || '[ID VOLUME]'}, assegurando a integridade e destino correto do produto.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Estilos inline básicos para garantir que funcione sem Tailwind configurado se necessário
  const inputStyle = "w-full p-2 border border-gray-300 rounded text-sm bg-white";
  
  return (
    <div className="flex flex-col md:flex-row h-screen font-sans text-gray-800 bg-gray-100">
      
      {/* Lado Esquerdo - Configuração e Inputs */}
      <div className="w-full md:w-1/2 flex flex-col h-full border-r border-gray-300 overflow-hidden">
        
        {/* Cabeçalho Configuração */}
        <div className="bg-gray-800 p-4 text-white shadow-md shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
            ⚙️ Configuração da Auditoria
          </h1>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-900">
             <select name="tipoControle" onChange={handleConfigChange} value={config.tipoControle} className="p-2 rounded bg-blue-100 font-bold border-none cursor-pointer">
              <option value="sistema">Sistema ERP (Protheus/SAP)</option>
              <option value="planilha">Planilhas (Excel/Drive)</option>
              <option value="fisico">Físico (Papel/Manual)</option>
            </select>
            <input type="text" name="nomeSistema" value={config.nomeSistema} onChange={handleConfigChange} placeholder="Nome do Sistema" className="p-2 rounded" />
            <input type="text" name="nomeDocRecebimento" value={config.nomeDocRecebimento} onChange={handleConfigChange} placeholder="Doc. Rec." className="p-2 rounded" />
            <input type="text" name="nomeDocProducao" value={config.nomeDocProducao} onChange={handleConfigChange} placeholder="Doc. Prod." className="p-2 rounded" />
            <input type="text" name="nomeDocExpedicao" value={config.nomeDocExpedicao} onChange={handleConfigChange} placeholder="Doc. Exp." className="p-2 rounded" />
            <input type="text" name="empresa" value={config.empresa} onChange={handleConfigChange} placeholder="Empresa" className="p-2 rounded" />
          </div>
        </div>

        {/* Formulário de Evidências */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          
          <div>
            <SectionHeader title="1. Recebimento" color="border-blue-500" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" name="rec_data" onChange={handleDataChange} className={inputStyle} />
              <input type="text" name="rec_nf" onChange={handleDataChange} placeholder="Nº NF" className={inputStyle} />
              <input type="text" name="rec_fornecedor" onChange={handleDataChange} placeholder="Fornecedor" className={`col-span-2 ${inputStyle}`} />
              <input type="text" name="rec_material" onChange={handleDataChange} placeholder="Material/Descrição" className={`col-span-2 ${inputStyle}`} />
              <input type="text" name="rec_lote" onChange={handleDataChange} placeholder="Lote Fornecedor" className={inputStyle} />
            </div>
          </div>

          <div>
            <SectionHeader title="2. Produção" color="border-orange-500" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="prod_op" onChange={handleDataChange} placeholder="Nº OP / Lote Interno" className={inputStyle} />
              <input type="date" name="prod_data" onChange={handleDataChange} className={inputStyle} />
              <input type="text" name="prod_produto" onChange={handleDataChange} placeholder="Produto Produzido" className={`col-span-2 ${inputStyle}`} />
              <input type="text" name="prod_qtd" onChange={handleDataChange} placeholder="Quantidade" className={inputStyle} />
              <input type="text" name="prod_registro" onChange={handleDataChange} placeholder="Registro (ex: FQ-036)" className={inputStyle} />
            </div>
          </div>

          <div>
            <SectionHeader title="3. Expedição" color="border-green-500" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="exp_doc" onChange={handleDataChange} placeholder="Doc. Saída (Romaneio)" className={inputStyle} />
              <input type="text" name="exp_rastreio" onChange={handleDataChange} placeholder="Rastreio (Etiqueta/Cor)" className={inputStyle} />
              <input type="text" name="exp_cliente" onChange={handleDataChange} placeholder="Cliente" className={`col-span-2 ${inputStyle}`} />
              <input type="text" name="exp_destino" onChange={handleDataChange} placeholder="Cidade/UF" className={`col-span-2 ${inputStyle}`} />
            </div>
          </div>

        </div>
      </div>

      {/* Lado Direito - Relatório Final */}
      <div className="w-full md:w-1/2 bg-gray-900 text-gray-200 p-6 overflow-y-auto flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📄 Relatório Gerado
          </h2>
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all shadow-lg ${copied ? 'bg-green-600 text-white scale-105' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {copied ? "✅ Copiado!" : "📋 Copiar Texto"}
          </button>
        </div>

        <div className="flex-1 bg-black/40 p-6 rounded-lg border border-gray-700 shadow-inner font-mono text-sm leading-loose whitespace-pre-wrap overflow-auto">
          {generateReport()}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
            Ferramenta de Evidências v2.0 - Adaptável (Sistema / Planilha / Físico)
        </div>
      </div>
    </div>
  );
};

export default UniversalAuditGenerator;