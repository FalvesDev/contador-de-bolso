/**
 * Ícones SVG Profissionais
 * Design moderno estilo fintech
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Wallet / Carteira
export function WalletIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M18 12H21V16H18C16.8954 16 16 15.1046 16 14C16 12.8954 16.8954 12 18 12Z"
        stroke={color}
        strokeWidth={2}
      />
      <Circle cx="18" cy="14" r="1" fill={color} />
    </Svg>
  );
}

// Arrow Up / Seta para cima (Receita)
export function ArrowUpIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Arrow Down / Seta para baixo (Despesa)
export function ArrowDownIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Trending Up / Tendência positiva
export function TrendingUpIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6H23V12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Trending Down / Tendência negativa
export function TrendingDownIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 18L13.5 8.5L8.5 13.5L1 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 18H23V12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Chart Pie / Gráfico de pizza
export function ChartPieIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.21 15.89A10 10 0 1 1 8.11 2.79"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M22 12A10 10 0 0 0 12 2V12H22Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Chart Bar / Gráfico de barras
export function ChartBarIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth={2} />
      <Rect x="10" y="8" width="4" height="13" rx="1" stroke={color} strokeWidth={2} />
      <Rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// Bell / Notificação
export function BellIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Settings / Configurações
export function SettingsIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Path
        d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95226 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87226 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95226 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87226 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Home
export function HomeIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 22V12H15V22"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// List / Lista de transações
export function ListIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 12H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 18H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="4" cy="6" r="1" fill={color} />
      <Circle cx="4" cy="12" r="1" fill={color} />
      <Circle cx="4" cy="18" r="1" fill={color} />
    </Svg>
  );
}

// User / Perfil
export function UserIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
      <Path
        d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Plus / Adicionar
export function PlusIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Calendar / Calendário
export function CalendarIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M16 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M3 10H21" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// Credit Card
export function CreditCardIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M2 10H22" stroke={color} strokeWidth={2} />
      <Path d="M6 15H10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Zap / Relâmpago (gasto rápido)
export function ZapIcon({ size = 24, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Target / Meta
export function TargetIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

// Dollar Sign
export function DollarIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V22" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Eye / Visualizar
export function EyeIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// Eye Off / Ocultar
export function EyeOffIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M1 1L23 23" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Microphone
export function MicrophoneIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth={2} />
      <Path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 18V22" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 22H16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Download / Export
export function DownloadIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M7 10L12 15L17 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 15V3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Chevron Right
export function ChevronRightIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

// Chevron Left
export function ChevronLeftIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

// Check / Confirmado
export function CheckIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// X / Fechar
export function XIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Lightbulb / Dica
export function LightbulbIcon({ size = 24, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 22H14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M15.09 14C15.662 13.373 16.0631 12.6102 16.2548 11.7826C16.4465 10.9551 16.4223 10.0905 16.1845 9.27482C15.9467 8.45914 15.503 7.71948 14.8962 7.12622C14.2895 6.53296 13.5406 6.1063 12.72 5.88687C11.8994 5.66743 11.0355 5.66248 10.2124 5.87259C9.38934 6.0827 8.63481 6.50103 8.02041 7.08765C7.40601 7.67428 6.9527 8.40888 6.70361 9.22195C6.45452 10.035 6.4182 10.8991 6.598 11.7306C6.77779 12.562 7.16756 13.3335 7.73 13.97L8 14.27V18H16V14.27L15.09 14Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Shopping Bag
export function ShoppingBagIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Car / Transporte
export function CarIcon({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 17H21V11L17.62 5.63C17.44 5.31 17.09 5.11 16.72 5.11H7.28C6.91 5.11 6.56 5.31 6.38 5.63L3 11V17H5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="7" cy="17" r="2" stroke={color} strokeWidth={2} />
      <Circle cx="17" cy="17" r="2" stroke={color} strokeWidth={2} />
      <Path d="M5 17H9M15 17H19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Utensils / Alimentação
export function UtensilsIcon({ size = 24, color = '#F97316' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 2V11C3 12.1046 3.89543 13 5 13H6C7.10457 13 8 12.1046 8 11V2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.5 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M5.5 13V22" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M17 2C17 2 21 3 21 8C21 13 17 14 17 14V22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Home House / Moradia
export function HouseIcon({ size = 24, color = '#8B5CF6' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Heart / Saúde
export function HeartIcon({ size = 24, color = '#EC4899' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69397 19.0554 3.41712C18.3879 3.14028 17.6725 2.99756 16.95 2.99756C16.2275 2.99756 15.5121 3.14028 14.8446 3.41712C14.1772 3.69397 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.90831 3.57831 8.50903 2.99805 7.05 2.99805C5.59097 2.99805 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54805 7.04097 1.54805 8.5C1.54805 9.95903 2.12831 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0329 10.6054C22.3097 9.93789 22.4525 9.22249 22.4525 8.5C22.4525 7.77751 22.3097 7.06211 22.0329 6.39464C21.756 5.72718 21.3508 5.12076 20.84 4.61Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Gamepad / Lazer
export function GamepadIcon({ size = 24, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12H10M8 10V14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="15" cy="11" r="1" fill={color} />
      <Circle cx="17" cy="13" r="1" fill={color} />
      <Rect x="2" y="6" width="20" height="12" rx="4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// GraduationCap / Educação
export function GraduationCapIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 5L2 10L12 15L22 10Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 12V17L12 20L18 17V12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 10V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Briefcase / Trabalho
export function BriefcaseIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 12V14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Fuel / Combustível
export function FuelIcon({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 22V5C3 3.89543 3.89543 3 5 3H13C14.1046 3 15 3.89543 15 5V22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 22H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x="6" y="7" width="6" height="5" rx="1" stroke={color} strokeWidth={2} />
      <Path d="M15 12H17C18.1046 12 19 12.8954 19 14V17C19 18.1046 19.8954 19 21 19V19C22.1046 19 23 18.1046 23 17V8L19 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// LogOut
export function LogOutIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Moon / Tema escuro
export function MoonIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Sun / Tema claro
export function SunIcon({ size = 24, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={2} />
      <Path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Palette / Temas
export function PaletteIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8284 22 13.5 21.3284 13.5 20.5C13.5 20.1216 13.3564 19.7716 13.1068 19.5068C12.857 19.2417 12.678 18.8917 12.678 18.5C12.678 17.6716 13.3496 17 14.178 17H16C19.3137 17 22 14.3137 22 11C22 6.02944 17.5228 2 12 2Z" stroke={color} strokeWidth={2} />
      <Circle cx="7.5" cy="11.5" r="1.5" fill={color} />
      <Circle cx="12" cy="7.5" r="1.5" fill={color} />
      <Circle cx="16.5" cy="11.5" r="1.5" fill={color} />
    </Svg>
  );
}

// Share
export function ShareIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Path d="M8.59 13.51L15.42 17.49" stroke={color} strokeWidth={2} />
      <Path d="M15.41 6.51L8.59 10.49" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// Filter
export function FilterIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Search
export function SearchIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Receipt / Extrato
export function ReceiptIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 10H16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 14H12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Shopping Cart
export function ShoppingCartIcon({ size = 24, color = '#F97316' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="21" r="1" stroke={color} strokeWidth={2} />
      <Circle cx="20" cy="21" r="1" stroke={color} strokeWidth={2} />
      <Path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.5C8.74 15.78 9.19 15.92 9.64 15.88H19.4C19.85 15.92 20.3 15.78 20.66 15.5C21.02 15.22 21.27 14.83 21.36 14.39L23 6H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Gift / Presente
export function GiftIcon({ size = 24, color = '#EC4899' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="14" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M12 8V22" stroke={color} strokeWidth={2} />
      <Path d="M3 12H21" stroke={color} strokeWidth={2} />
      <Path d="M7.5 8C6.30653 8 5.16193 7.52589 4.31802 6.68198C3.47411 5.83807 3 4.69347 3 3.5C3 3.5 7 3.5 8.5 5C10 6.5 12 8 12 8C12 8 10 6.5 10 4.5C10 2.5 12 2 12 2C12 2 14 2.5 14 4.5C14 6.5 12 8 12 8C12 8 14 6.5 15.5 5C17 3.5 21 3.5 21 3.5C21 4.69347 20.5259 5.83807 19.682 6.68198C18.8381 7.52589 17.6935 8 16.5 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Alert / Alerta
export function AlertIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 9V13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="17" r="1" fill={color} />
      <Path d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.67 1.55 19.03C1.56 19.39 1.66 19.75 1.85 20.06C2.04 20.37 2.31 20.62 2.63 20.8C2.95 20.97 3.31 21.06 3.68 21.05H20.32C20.69 21.06 21.05 20.97 21.37 20.8C21.69 20.62 21.96 20.37 22.15 20.06C22.34 19.75 22.44 19.39 22.45 19.03C22.45 18.67 22.36 18.31 22.18 18L13.71 3.86C13.52 3.56 13.26 3.31 12.95 3.14C12.64 2.97 12.29 2.88 11.94 2.88C11.59 2.88 11.24 2.97 10.93 3.14C10.62 3.31 10.36 3.56 10.17 3.86H10.29Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Shield / Proteção
export function ShieldIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Edit / Editar
export function EditIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// CheckCircle / Sucesso
export function CheckCircleIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Trash / Lixeira
export function TrashIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H5H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ChevronDown / Seta para baixo
export function ChevronDownIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// PiggyBank / Cofrinho
export function PiggyBankIcon({ size = 24, color = '#EC4899' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 5C17.89 5 17 5.89 17 7V8H7C4.24 8 2 10.24 2 13C2 15.76 4.24 18 7 18H7.17L6.58 19.17C6.38 19.57 6.5 20.06 6.85 20.32C7.14 20.54 7.53 20.54 7.82 20.32L10 18H14L16.18 20.32C16.47 20.54 16.86 20.54 17.15 20.32C17.5 20.06 17.62 19.57 17.42 19.17L16.83 18H17C19.76 18 22 15.76 22 13V7C22 5.89 21.11 5 20 5H19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="14" cy="12" r="1" fill={color} />
      <Path d="M2 13H4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Clipboard / Notas
export function ClipboardIcon({ size = 24, color = '#64748B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M9 2V4C9 4.55228 9.44772 5 10 5H14C14.5523 5 15 4.55228 15 4V2" stroke={color} strokeWidth={2} />
      <Path d="M9 12H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M9 16H13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Componente de ícone circular com fundo
interface CircleIconProps extends IconProps {
  Icon: React.ComponentType<IconProps>;
  backgroundColor?: string;
}

export function CircleIcon({ Icon, size = 40, color, backgroundColor = '#EEF2FF' }: CircleIconProps) {
  return (
    <View style={[styles.circleIcon, { width: size, height: size, backgroundColor, borderRadius: size / 2 }]}>
      <Icon size={size * 0.5} color={color} />
    </View>
  );
}

// Tipo de nome de ícone para categorias (definido inline para evitar dependência circular)
export type IconNameType =
  | 'utensils' | 'shopping-cart' | 'car' | 'house' | 'heart'
  | 'gamepad' | 'shopping-bag' | 'graduation-cap' | 'briefcase'
  | 'fuel' | 'credit-card' | 'dollar' | 'trending-up' | 'gift'
  | 'receipt' | 'target' | 'zap' | 'wallet';

type IconName =
  | 'utensils' | 'shopping-cart' | 'car' | 'house' | 'heart'
  | 'gamepad' | 'shopping-bag' | 'graduation-cap' | 'briefcase'
  | 'fuel' | 'credit-card' | 'dollar' | 'trending-up' | 'gift'
  | 'receipt' | 'target' | 'zap' | 'wallet';

// Mapeamento de IconName para componente de ícone
const iconMap: Record<IconName, React.ComponentType<IconProps>> = {
  'utensils': UtensilsIcon,
  'shopping-cart': ShoppingCartIcon,
  'car': CarIcon,
  'house': HouseIcon,
  'heart': HeartIcon,
  'gamepad': GamepadIcon,
  'shopping-bag': ShoppingBagIcon,
  'graduation-cap': GraduationCapIcon,
  'briefcase': BriefcaseIcon,
  'fuel': FuelIcon,
  'credit-card': CreditCardIcon,
  'dollar': DollarIcon,
  'trending-up': TrendingUpIcon,
  'gift': GiftIcon,
  'receipt': ReceiptIcon,
  'target': TargetIcon,
  'zap': ZapIcon,
  'wallet': WalletIcon,
};

// Componente CategoryIcon que renderiza o ícone baseado no nome
interface CategoryIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function CategoryIcon({ name, size = 24, color }: CategoryIconProps) {
  const IconComponent = iconMap[name] || ReceiptIcon;
  return <IconComponent size={size} color={color} />;
}

const styles = StyleSheet.create({
  circleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
