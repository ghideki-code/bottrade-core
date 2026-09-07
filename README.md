# BotTrade Core

Motor central do BotTrade para análise de mercado, agentes IA, score mestre, Risk Engine, Paper Trading, backtest, journal e métricas.

## Princípios

- **Analysis Mode** e **Paper Trading Mode** apenas.
- Nenhuma função de execução de ordens reais.
- Binance como fonte de dados de mercado.
- Gemini como provedor principal de IA, atrás de uma abstração de provider.
- Dados inválidos, incompletos ou obsoletos bloqueiam a tomada de decisão.
- Consenso de IA nunca é inventado.
- Risk Engine é uma barreira independente e obrigatória.
- Arquitetura preparada para futura execução, sem caminho de ordem real nesta versão.

## Timeframes oficiais

| Timeframe | Papel |
|---|---|
| 4H | Macro |
| 1H | Contexto intermediário |
| 15M | Contexto de execução |
| 5M | Gatilho |

## Estrutura inicial

```text
src/
  market/
    binance/
    sanity/
    timeframes/
  core/
    types.ts
    errors.ts
  config/
  index.ts
tests/
```

## Configuração

Copie `.env.example` para `.env` e configure a chave do Gemini quando os agentes IA forem ativados.

O projeto começa pelo pipeline determinístico de dados. Nenhum sinal de trade é fabricado quando a Binance não fornece dados válidos.

## Desenvolvimento

```bash
npm install
npm run typecheck
npm run build
```
