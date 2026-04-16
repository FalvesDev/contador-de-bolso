# Guia de Animacoes - Contador de Bolso

## Visao Geral

Este documento descreve o sistema de animacoes do app, garantindo uma experiencia fluida e consistente em todas as telas.

---

## 1. Tipos de Animacoes

### 1.1 Animacoes de Entrada (Entrance)

| Tipo | Duracao | Easing | Uso |
|------|---------|--------|-----|
| Fade In | 400ms | ease-out | Textos, labels |
| Slide Up + Fade | 500ms | spring | Cards, secoes |
| Scale + Fade | 400ms | spring | Saldo, valores importantes |
| Stagger | 100ms delay | sequential | Listas, multiplos cards |

### 1.2 Animacoes de Interacao (Feedback)

| Tipo | Duracao | Easing | Uso |
|------|---------|--------|-----|
| Scale Press | 150ms | spring | Botoes, cards clicaveis |
| Bounce | 300ms | elastic | Confirmacoes, sucesso |
| Shake | 250ms | linear | Erros, alertas |
| Pulse | 1600ms loop | ease-in-out | Notificacoes, atencao |

### 1.3 Animacoes de Transicao (Navigation)

| Tipo | Duracao | Easing | Uso |
|------|---------|--------|-----|
| Slide Horizontal | 300ms | ease-out | Troca de telas |
| Fade Cross | 200ms | ease | Modais |
| Scale Modal | 250ms | spring | Bottom sheets |

---

## 2. Hooks Disponiveis

### useAnimations.ts

```typescript
// Fade in simples
const opacity = useFadeIn(delay, duration);

// Slide + fade (direcao: up, down, left, right)
const { opacity, transform } = useSlideIn('up', delay, duration);

// Escala ao pressionar
const { scale, onPressIn, onPressOut } = useScalePress(0.95);

// Pulse continuo (loop)
const scale = usePulse(0.97, 1.03);

// Shake para erros
const { translateX, shake } = useShake();

// Bounce para feedback
const { scale, bounce } = useBounce();

// Contador numerico animado
const value = useCountUp(targetValue, duration);

// Barra de progresso animada
const progress = useProgress(targetProgress, duration);

// Lista com animacao staggered
const animations = useStaggeredList(itemCount, staggerDelay);

// Rotacao (loading)
const rotate = useRotation(duration);

// Entrada com spring
const { scale, opacity } = useSpringIn(delay);
```

---

## 3. Componentes Animados

### AnimatedComponents.tsx

| Componente | Descricao | Props |
|------------|-----------|-------|
| `AnimatedPressable` | Base clicavel com scale | onPress, scaleOnPress |
| `AnimatedButton` | Botao com feedback visual | variant, size, loading |
| `AnimatedCard` | Card com entrada animada | delay, elevated, onPress |
| `AnimatedFAB` | Floating Action Button | icon, color, size |
| `AnimatedBadge` | Badge com bounce | count, color |
| `AnimatedIconButton` | Icone clicavel | icon, size |
| `AnimatedSection` | Secao com fade in | delay |

---

## 4. Implementacao por Tela

### 4.1 HomeScreen

```
[IMPLEMENTADO]
- Header: fade + slide down (delay 0)
- Saldo: scale + fade (delay 100ms)
- Cards Receita/Despesa: slide up staggered (delay 200/300ms)
- Visao Geral: slide up (delay 400ms)
- Categorias: slide up (delay 500ms)
- Sino: pulse quando ha notificacoes
- Botoes: scale on press (0.95)
```

### 4.2 TransactionsScreen

```
[A IMPLEMENTAR]
- Lista: stagger animation (100ms entre itens)
- Filtros: fade in
- FAB adicionar: spring entrance
- Swipe delete: slide out
```

### 4.3 ReportsScreen

```
[A IMPLEMENTAR]
- Graficos: draw animation (progress)
- Cards de analise: stagger slide up
- Calendario: scale entrance
- Score de saude: circular progress
```

### 4.4 ProfileScreen

```
[A IMPLEMENTAR]
- Avatar: scale entrance
- Opcoes: stagger fade in
- Toggle switches: spring
```

### 4.5 Modais e Sheets

```
[A IMPLEMENTAR]
- Bottom Sheet: slide up + fade backdrop
- Alert: scale + fade
- Confirmacao: bounce
```

---

## 5. Configuracoes Globais

### animation.config.ts

```typescript
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,      // Feedback rapido
    normal: 300,    // Transicoes padrao
    slow: 500,      // Entradas elaboradas
    entrance: 600,  // Primeira aparicao
  },
  easing: {
    smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    elastic: Easing.elastic(1),
    spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  },
  spring: {
    default: { friction: 8, tension: 60 },
    bouncy: { friction: 5, tension: 80 },
    stiff: { friction: 10, tension: 100 },
  },
};
```

---

## 6. Boas Praticas

### DO (Fazer)
- Usar `useNativeDriver: true` sempre que possivel
- Manter animacoes sutis (nao exagerar)
- Dar feedback visual em TODAS as acoes do usuario
- Usar stagger para listas (max 100ms delay)
- Cancelar animacoes em unmount

### DON'T (Nao fazer)
- Animacoes longas (> 600ms para entradas)
- Animacoes que bloqueiam interacao
- Bounce excessivo (motion sickness)
- Muitas animacoes simultaneas
- Ignorar performance em listas longas

---

## 7. Performance

### Otimizacoes Recomendadas

1. **useNativeDriver**: Sempre usar para transform e opacity
2. **InteractionManager**: Atrasar animacoes pesadas
3. **shouldComponentUpdate**: Evitar re-renders desnecessarios
4. **FlatList**: Usar para listas longas com animacao
5. **Reanimated**: Considerar para animacoes complexas

---

## 8. Proximos Passos

- [ ] Aplicar animacoes na TransactionsScreen
- [ ] Aplicar animacoes na ReportsScreen
- [ ] Aplicar animacoes na ProfileScreen
- [ ] Criar animacoes para graficos
- [ ] Implementar gesture-based animations
- [ ] Adicionar haptic feedback (vibracoes)
- [ ] Testar performance em dispositivos low-end
