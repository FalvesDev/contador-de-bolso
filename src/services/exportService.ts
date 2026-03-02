/**
 * Serviço de Exportação de Dados
 * Permite exportar transações em formato CSV
 */

import { Platform, Share, Alert } from 'react-native';

// Importação condicional para evitar problemas na web
let FileSystem: any = null;
let Sharing: any = null;

if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system');
  Sharing = require('expo-sharing');
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  date: Date;
}

interface ExportOptions {
  startDate?: Date;
  endDate?: Date;
  type?: 'all' | 'expense' | 'income';
  format?: 'csv' | 'txt';
}

/**
 * Converte uma lista de transações para formato CSV
 */
export function transactionsToCSV(
  transactions: Transaction[],
  getCategoryName: (id: string) => string
): string {
  // Header do CSV
  const header = 'Data,Descrição,Categoria,Tipo,Valor\n';

  // Linhas de dados
  const rows = transactions.map(t => {
    const date = t.date.toLocaleDateString('pt-BR');
    const description = `"${t.description.replace(/"/g, '""')}"`;
    const category = getCategoryName(t.categoryId);
    const type = t.type === 'income' ? 'Receita' : 'Despesa';
    const value = t.type === 'income'
      ? t.amount.toFixed(2)
      : `-${t.amount.toFixed(2)}`;

    return `${date},${description},${category},${type},${value}`;
  }).join('\n');

  return header + rows;
}

/**
 * Gera um resumo em texto das transações
 */
export function generateSummary(
  transactions: Transaction[],
  getCategoryName: (id: string) => string
): string {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Agrupar por categoria
  const byCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = getCategoryName(t.categoryId);
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a);

  let summary = `
══════════════════════════════════════
       CONTADOR DE BOLSO - RELATÓRIO
══════════════════════════════════════

Período: ${transactions.length > 0
    ? `${transactions[transactions.length - 1].date.toLocaleDateString('pt-BR')} a ${transactions[0].date.toLocaleDateString('pt-BR')}`
    : 'Sem dados'}

RESUMO FINANCEIRO
────────────────────
  Receitas:  R$ ${totalIncome.toFixed(2).replace('.', ',')}
  Despesas:  R$ ${totalExpense.toFixed(2).replace('.', ',')}
  ─────────────────────
  Saldo:     R$ ${balance.toFixed(2).replace('.', ',')}

GASTOS POR CATEGORIA
────────────────────
${sortedCategories.map(([cat, value]) => {
    const percent = totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : '0';
    return `  ${cat}: R$ ${value.toFixed(2).replace('.', ',')} (${percent}%)`;
  }).join('\n')}

Total de transações: ${transactions.length}
   - Receitas: ${transactions.filter(t => t.type === 'income').length}
   - Despesas: ${transactions.filter(t => t.type === 'expense').length}

══════════════════════════════════════
  Exportado em ${new Date().toLocaleString('pt-BR')}
  Contador de Bolso - Seu controle financeiro
══════════════════════════════════════
`;

  return summary;
}

/**
 * Exporta transações para arquivo CSV e compartilha
 */
export async function exportToCSV(
  transactions: Transaction[],
  getCategoryName: (id: string) => string,
  options: ExportOptions = {}
): Promise<boolean> {
  try {
    // Filtrar transações se necessário
    let filtered = [...transactions];

    if (options.startDate) {
      filtered = filtered.filter(t => t.date >= options.startDate!);
    }
    if (options.endDate) {
      filtered = filtered.filter(t => t.date <= options.endDate!);
    }
    if (options.type && options.type !== 'all') {
      filtered = filtered.filter(t => t.type === options.type);
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

    if (filtered.length === 0) {
      Alert.alert('Aviso', 'Não há transações para exportar.');
      return false;
    }

    // Gerar conteúdo
    const csvContent = transactionsToCSV(filtered, getCategoryName);
    const summary = generateSummary(filtered, getCategoryName);

    // Nome do arquivo
    const date = new Date().toISOString().split('T')[0];
    const csvFileName = `contador-de-bolso-${date}.csv`;

    // Verificar se estamos na web
    if (Platform.OS === 'web') {
      // Na web, fazer download direto
      downloadFile(csvContent, csvFileName, 'text/csv');
      return true;
    }

    // No mobile, usar a nova API do expo-file-system
    if (FileSystem && Sharing) {
      const { File, Paths } = FileSystem;

      const csvFile = new File(Paths.document, csvFileName);
      csvFile.write(csvContent);

      // Verificar se pode compartilhar
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(csvFile.uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exportar transações',
          UTI: 'public.comma-separated-values-text',
        });
        return true;
      }
    }

    // Fallback para Share nativo
    await Share.share({
      message: summary,
      title: 'Contador de Bolso - Relatório',
    });
    return true;
  } catch (error) {
    console.error('Erro ao exportar:', error);
    Alert.alert(
      'Erro',
      'Não foi possível exportar os dados. Tente novamente.'
    );
    return false;
  }
}

/**
 * Download de arquivo na web
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  if (typeof document === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Compartilha resumo via Share nativo (texto simples)
 */
export async function shareTextSummary(
  transactions: Transaction[],
  getCategoryName: (id: string) => string
): Promise<boolean> {
  try {
    const summary = generateSummary(transactions, getCategoryName);

    await Share.share({
      message: summary,
      title: 'Contador de Bolso - Relatório',
    });

    return true;
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
    return false;
  }
}
