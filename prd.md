# PRD - Jardim de Viana (Sistema de Reservas)

Este documento descreve as funcionalidades principais do sistema de gestão de reservas para o restaurante Jardim de Viana.

## 1. Fluxo do Cliente (Reserva Online)
O sistema guia o cliente através de um processo intuitivo de 6 passos:
*   **Configuração Inicial**: Escolha da data, número de pessoas e horário (Almoço/Jantar).
*   **Seleção de Mesa**: Mapa interativo para escolher a mesa disponível no slot selecionado.
*   **Dados do Cliente**: Recolha de nome, telefone e email.
*   **Pagamento**: Instruções detalhadas para pagamento (ex: IBAN/Referência) para garantir a reserva.
*   **Upload de Comprovativo**: Upload seguro de imagens ou PDFs do comprovativo de pagamento.
*   **Confirmação Final**: Geração de um código de referência único para consulta posterior.

## 2. Consulta de Estado
*   Funcionalidade que permite ao cliente inserir o seu código de referência para verificar se a reserva já foi confirmada pela administração.

## 3. Backoffice Administrativo
Painel restrito para a gestão do restaurante com as seguintes capacidades:
*   **Gestão de Reservas**: Lista completa de pedidos com filtros de pesquisa por nome ou referência.
*   **Controlo de Estados**: Botões rápidos para confirmar, rejeitar ou marcar como "concluída" (libertando a mesa).
*   **Visualização de Comprovativos**: Modal integrado para validar rapidamente os pagamentos enviados pelos clientes.
*   **Gestão de Mesas**: Interface drag-and-drop para adicionar, remover ou reposicionar mesas no mapa virtual do restaurante.

## 4. Backend e Infraestrutura
*   **Base de Dados Supabase**: Armazenamento persistente de todas as reservas e configurações de mesas.
*   **Storage (Buckets)**: Armazenamento seguro de ficheiros de comprovativos.
*   **Lógica de Conflitos**: Bloqueio automático de mesas já reservadas para o mesmo período (Almoço ou Jantar).
*   **Arquitetura Híbrida**: Frontend em React (Vite) com backend em Express, otimizado para deploy na Vercel.

## 5. Design e Experiência
*   **Estética Premium**: Interface escura com acentos em cor de marca (brand-orange), tipografia elegante e animações suaves.
*   **Design Responsivo**: Adaptado para telemóveis, tablets e computadores.
