'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/Header'
import WhatsappButton from './components/WhatsappButton'
import Footer from './components/Footer'

type Course = {
  id: number
  titulo: string
  subtitulo: string | null
  categoria: string
  bg: string
  shadow: string
  textColor: string
  emoji: string
  preco: string,
  productId: string,
  imagem?: string
}

const courses: Course[] = [
 
  // ─── FORMAÇÃO ESPECIALIZADA ───────────────────────────────────────────────
  { id: 1,  titulo: 'Carga Indivisível Formação',             subtitulo: 'CETCI',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚛', preco: 'R$ 260,00', productId: 'prod_PUsCwUrUYwwhuydfmN4HtFu6', imagem: "/img/CARGA_INDIVISIVEL.png" },
  { id: 2,  titulo: 'Coletivo de Passageiros Formação',       subtitulo: 'CETCP',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚌', preco: 'R$ 260,00', productId: 'prod_PcgrqBLyNUGmLhJqg6aPzUpP', imagem: "/img/COLETIVO.png" },
  { id: 3,  titulo: 'Emergência Formação',                    subtitulo: 'CETVE',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚑', preco: 'R$ 260,00', productId: 'prod_fYsaJFATU3ZznqUkW0gmxfUz', imagem: "/img/EMERGÊNCIA.png" },
  { id: 4,  titulo: 'Escolar Formação',                       subtitulo: 'CETE',   categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🏫', preco: 'R$ 260,00', productId: 'prod_r4BZPqU1Hx42xDuYxeFZE2FC', imagem: "/img/escolar.png" },
  { id: 5,  titulo: 'Produtos Perigosos - MOPP Formação',     subtitulo: 'CETPP',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '☢️', preco: 'R$ 260,00', productId: 'prod_32C2Nf1jG2AHQ1UFAzxLDjhZ', imagem: "/img/PRODUTOS_PERIGOSOS.png" },
 
  // ─── ATUALIZAÇÃO ESPECIALIZADA ────────────────────────────────────────────
  { id: 6,  titulo: 'Carga Indivisível Atualização',          subtitulo: 'CETCI',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚛', preco: 'R$ 220,00', productId: 'prod_Q5bMzN2WHwTQwHkCdSXYGKeZ', imagem: "/img/CARGA_INDIVISIVEL_ATUALIZACAO.png" },
  { id: 7,  titulo: 'Coletivo de Passageiros Atualização',    subtitulo: 'CETCP',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚌', preco: 'R$ 220,00', productId: 'prod_DyTkNx5MmTEn0HdYGGYKAP3n', imagem: "/img/COLETIVO_ATUALIZACAO.png" },
  { id: 8,  titulo: 'Emergência Atualização',                 subtitulo: 'CETVE',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚑', preco: 'R$ 220,00', productId: 'prod_1nrTQHXEnkWPQbpQtWKE2tQJ', imagem: "/img/EMERGENCIA_ATUALIZACAO.png" },
  { id: 9,  titulo: 'Escolar Atualização',                    subtitulo: 'CETE',   categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🏫', preco: 'R$ 220,00', productId: 'prod_uwTbzdBNFABwBM4jh3hUZXKa', imagem: "/img/ESCOLAR_ATUALIZACAO.png" },
  { id: 10, titulo: 'Produtos Perigosos - MOPP Atualização',  subtitulo: 'CETPP',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '☢️', preco: 'R$ 220,00', productId: 'prod_Aub4S2MtFtdbSZrCJAmkfCpY', imagem: "/img/MOPP_ATUALIZAÇÃO.png" },
 
  // ─── RECICLAGEM CNH ───────────────────────────────────────────────────────
  { id: 11, titulo: 'Atualização para Renovação da CNH',      subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🔄', preco: 'R$ 100,00',  productId: 'prod_gHJkfUepXhqtxum1XZUwF4Y6', imagem: "/img/CURSO_RECICLAGEM.png" },
  { id: 12, titulo: 'Curso Preventivo de Reciclagem',         subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🔄', preco: 'R$ 100,00',  productId: 'prod_DE0aKME2rpnJUr5wJUKRPZTC', imagem: "img/CURSO_RECICLAGEM.png" },
  { id: 13, titulo: 'Reciclagem para Condutores Infratores',  subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '⚠️', preco: 'R$ 100,00',  productId: 'prod_zD60RGkYnJWRNSp2xEYbUw4c', imagem: "/img/CURSO_RECICLAGEM_2021.png" },
 
  // ─── TAXISTA / APP ────────────────────────────────────────────────────────
  { id: 14, titulo: 'Curso para Taxista',                     subtitulo: null,     categoria: 'Profissional', bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '🚕', preco: 'R$ 180,00',  productId: 'prod_ZknCmFdTpb1sFGYuxFAkSGzG', imagem: "/img/TAXISTA.png" },
  { id: 15, titulo: 'Curso para Condutor de App',             subtitulo: null,     categoria: 'Profissional', bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '📱', preco: 'R$ 180,00',  productId: 'prod_1JDCwETAsrp25TmWzbQarwgX', imagem: "/img/CURSO_CONDUTORES_APP.png" },
 
  // ─── MOTO ─────────────────────────────────────────────────────────────────
  { id: 16, titulo: 'Motofrete Atualização',                  subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏍️', preco: 'R$ 260,00', productId: 'prod_6MAUQZD2J6HHtrfFUYFMTSft', imagem: "/img/motofrete1.png" },
  { id: 17, titulo: 'Motofrete Formação',                     subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏍️', preco: 'R$ 260,00', productId: 'prod_zbuEqmwwW6cnht2sR5SbPwYC', imagem: "/img/motofrete2.png" },
  { id: 18, titulo: 'Mototáxi Atualização',                   subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🛵', preco: 'R$ 260,00', productId: 'prod_CNYuZBfJHsaUpym2WqncYxCB', imagem: "/img/mototaxi1.png" },
  { id: 19, titulo: 'Mototáxi Formação',                      subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🛵', preco: 'R$ 260,00', productId: 'prod_zyPqf1X16X2hhKXSekRyBbAT', imagem: "/img/mototaxi2.png" },
 
  // ─── NORMAS REGULAMENTADORAS (NR) ─────────────────────────────────────────
  { id: 20, titulo: 'Operador de Empilhadeiras Atualização',  subtitulo: '100% online', categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🏗️', preco: 'R$ 130,00', productId: 'prod_RDZ3yL0MhffHpqFzY5dQmphr', imagem: "/img/empilhadeira.webp" },
  { id: 21, titulo: 'NR 06',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🦺', preco: 'R$ 130,00', productId: 'prod_YfUwJWPt4aNCEgkamCp6pwhf', imagem: "/img/NR06.png" },
  { id: 22, titulo: 'NR 10',                                  subtitulo: '40h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚡', preco: 'R$ 130,00', productId: 'prod_fTeuBgnEpN221skRAGSqU6Cx', imagem: "/img/NR10.png" },
  { id: 23, titulo: 'NR 11',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '📦', preco: 'R$ 130,00', productId: 'prod_fwEeRgE5ZDLqpzgtsc1U5DeG', imagem: "/img/NR11.png" },
  { id: 24, titulo: 'NR 12',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚙️', preco: 'R$ 130,00', productId: 'prod_YYRpgu4DCteHw6ukw4N4EeAD', imagem: "/img/NR12.png" },
  { id: 25, titulo: 'NR 16',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🔥', preco: 'R$ 130,00', productId: 'prod_jtmcEKqcAEqHwShtMRSEHkYk', imagem: "/img/nr16.png" },
  { id: 26, titulo: 'NR 20 - Básico',                         subtitulo: '8h',          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 130,00', productId: 'prod_umghGpJXNNp6gHK4NdXgL6CY', imagem: "/img/NR20.png" },
  { id: 27, titulo: 'NR 20 - Intermediário Classe 01',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 130,00', productId: 'prod_bwAwNXdbfz11AyhRjpfFbhFW', imagem: "/img/NR20 ClasseI.png" },
  { id: 28, titulo: 'NR 20 - Intermediário Classe 02',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 130,00', productId: 'prod_T45xA6tTTBUgBzx0Er2FRrgQ', imagem: "/img/NR20 ClasseII.png" },
  { id: 29, titulo: 'NR 20 - Intermediário Classe 03',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 130,00', productId: 'prod_JPWS5YeKWZDjfcRENa6WNXCY', imagem: "/img/NR20 ClasseII.png" },
  { id: 30, titulo: 'NR 29',                                  subtitulo: '24h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚓', preco: 'R$ 130,00', productId: 'prod_bejZEkXpPRbpEbqU6uSxcntT', imagem: "/img/NR29.png" },
  { id: 31, titulo: 'NR 33',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🕳️', preco: 'R$ 130,00', productId: 'prod_EjqXjuB122DHtrhEzNrFdweY', imagem: "/img/NR 33.png" },
  { id: 32, titulo: 'NR 35 - 2024',                           subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🧗', preco: 'R$ 130,00', productId: 'prod_chxdawxdacATDEZSecgcw0u6', imagem: "/img/NR35.png" },
 
  // ─── CAPACITAÇÃO PROFISSIONAL ─────────────────────────────────────────────
  { id: 33, titulo: 'Atendimento ao Cliente',                              subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🤝', preco: 'R$ 130,00', productId: 'prod_zBfW33WGHP2wxE2MqHsacgMc', imagem: "/img/atendimento_ao_cliente.png" },
  { id: 34, titulo: 'Atendimento Pré-Hospitalar (APH)',                    subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🏥', preco: 'R$ 130,00', productId: 'prod_zM5MCWfRcdgGQwgQ15dCU0Fh', imagem: "/img/Curso Teorico Atendimento Pré-Hospitalar (APH).png" },
  { id: 35, titulo: 'Condutor e Monitor para Passageiros com Mobilidade Reduzida', subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '♿', preco: 'R$ 130,00', productId: 'prod_jN42b2gpnE4WAx1YArf3WaAT', imagem: "/img/mobilidadereduzida.png" },
  { id: 36, titulo: 'Condução Segura para Motoristas de Caminhão',         subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🚚', preco: 'R$ 130,00', productId: 'prod_x2wLnDZ3KcCjXT1jn0RqnrSF', imagem: "/img/Condução_Segura_para_Motoristas_de_Caminhão_CAPA.png" },
  { id: 37, titulo: 'Condução Segura para Motoristas de Ônibus',           subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🚍', preco: 'R$ 130,00', productId: 'prod_ddfhPnwER0wpe26XzjSyWS1P', imagem: "/img/Condução_Segura_para_Motoristas_de_Ônibus_CAPA.png" },
  { id: 38, titulo: 'Direção Defensiva',                                   subtitulo: 'Validade 1 ano',   categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🛡️', preco: 'R$ 130,00', productId: 'prod_NY5W0RrQ5EXCYLkLy5SqAAk1', imagem: "/img/DIRECAO_DEFENSIVA.png" },
  { id: 39, titulo: 'Direção Defensiva',                                   subtitulo: 'Validade 2 anos',  categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🛡️', preco: 'R$ 130,00', productId: 'prod_c5nGUpLCUeTJuqzn4QqHNymB', imagem: "/img/DIRECAO_DEFENSIVA.png" },
  { id: 40, titulo: 'Manutenção Automotiva para Profissionais do Transporte', subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🔧', preco: 'R$ 130,00', productId: 'prod_QCNcdq1Pj5rpDe0pGQKRqKLN', imagem: "/img/Manutenção_Automotiva_para_Profissionais_do_Transporte_CAPA.png" },
  { id: 41, titulo: 'Segurança e Saúde no Transporte de Cargas',           subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🦺', preco: 'R$ 130,00', productId: 'prod_N33AzaXnzfDphJkCeUMkGNtc', imagem: "/img/Segurança_e_Saúde_no_Transporte_de_Cargas_CAPA.png" },
  { id: 42, titulo: 'Transporte de Cargas',                                subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '📦', preco: 'R$ 130,00', productId: 'prod_LRs5GASW2wwRaLc4ws1PYQdk', imagem: "/img/TRANSPORTE_DE_CARGAS_CAPA.png" },
  { id: 43, titulo: 'Direção Econômica e Tecnologia no Transporte',        subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '♻️', preco: 'R$ 130,00', productId: 'prod_ypaJAUBycf4zW5GQ6nm3GwBT', imagem: "/img/Direção_Econômica_e_Tecnologia_no_Transporte_CAPA.png" },
  { id: 44, titulo: 'Gestão Logística e Otimização de Processos',          subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '📊', preco: 'R$ 130,00', productId: 'prod_xkBaNKeh5BkHB6BhhRuqgFaa', imagem: "/img/Gestão_Logística_e_Otimização_de_Processos_na_Cadeia_de_Suprimentos_CAPA.png" },
  { id: 45, titulo: 'Gestão de Fretes',                                    subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '💰', preco: 'R$ 130,00', productId: 'prod_RqfqhAjLQZE4p00J5BnTUb6Q', imagem: "/img/Gestão_de_Fretes_-_Estratégias_para_Eficiência_no_Transporte_de_Mercadorias_CAPA.png" },
  { id: 46, titulo: 'Gestão de Pneus no Transporte',                       subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🔵', preco: 'R$ 130,00', productId: 'prod_GCnrJBLmeLJ4aGxYsq13EzJH', imagem: "/img/Gestão_de_Pneus_no_Transporte_CAPA.png" },
  { id: 47, titulo: 'Monitor de Transporte Escolar',                       subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🏫', preco: 'R$ 130,00', productId: 'prod_t1AXgkGWfDUAeUbBMcR1gpRj', imagem: "/img/monitor_escolar.png" },
  { id: 48, titulo: 'Noções Básicas de Primeiros Socorros',                subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🩺', preco: 'R$ 130,00', productId: 'prod_zTyngueZwbjMNNmwpajuUUqb', imagem: "/img/primeiros_socorros.png" },
  { id: 49, titulo: 'Prevenção e Combate a Incêndio',                      subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🧯', preco: 'R$ 130,00', productId: 'prod_HDWtpTCEWeuQSacKzdjZfFcU', imagem: "/img/combate_incendio.png" },
  
  // ─── CURSOS DE TRÂNSITO AVANÇADOS / TRABALHO (ESQUECIDOS) ─────────────────
  { id: 50, titulo: 'Curso de Junta Administrativa e Recursos de Infração (JARI)', subtitulo: '16h', categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '⚖️', preco: 'R$ 400,00', productId: 'prod_hynh5HsHS1Kf6exXHbSfNrPP', imagem: "/img/jari.png" },
  { id: 51, titulo: 'Formação para Instrutor de CFC', subtitulo: '180h', categoria: 'Instrutor', bg: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-300', textColor: 'text-white', emoji: '👨‍🏫', preco: 'R$ 3000,00', productId: 'prod_33FUMPnkHYhPAkw6356CZU6r', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 52, titulo: 'Complementação para Instrutor de CFC', subtitulo: '60h', categoria: 'Instrutor', bg: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-300', textColor: 'text-white', emoji: '📚', preco: 'R$ 1400,00', productId: 'prod_RMj0TcXsf6yuYNUgGg1NTDQG', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 53, titulo: 'Atualização para Instrutor de CFC', subtitulo: '20h', categoria: 'Instrutor', bg: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-300', textColor: 'text-white', emoji: '🔄', preco: 'R$ 600,00', productId: 'prod_Jxhp1BhjYeRNmLBtZ0ujuUsz', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 54, titulo: 'Formação para Diretor Geral de CFC', subtitulo: '40h', categoria: 'Diretor', bg: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-300', textColor: 'text-white', emoji: '👔', preco: 'R$ 1200,00', productId: 'prod_a2MuyQ6uzXqKEarMTmCkr35y', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 55, titulo: 'Formação para Diretor de Ensino de CFC', subtitulo: '40h', categoria: 'Diretor', bg: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-300', textColor: 'text-white', emoji: '📝', preco: 'R$ 1200,00', productId: 'prod_xrn2fHzLLHEpQuGC14rj5NPL', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 56, titulo: 'Atualização para Diretor Geral de CFC', subtitulo: '20h', categoria: 'Diretor', bg: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-300', textColor: 'text-white', emoji: '🔄', preco: 'R$ 700,00', productId: 'prod_XrffrJ3F1JzjyPBq1MrGKdmM', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 57, titulo: 'Atualização para Diretor de Ensino de CFC', subtitulo: '20h', categoria: 'Diretor', bg: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-300', textColor: 'text-white', emoji: '🔄', preco: 'R$ 700,00', productId: 'prod_SxgfWuhZa4ud4Z1UPWRNcCfs', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 58, titulo: 'Formação para Examinador de Trânsito', subtitulo: '28h', categoria: 'Examinador', bg: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-300', textColor: 'text-white', emoji: '📋', preco: 'R$ 900,00', productId: 'prod_Rh3peHPAJKuGdTeGDr0hkCW0', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 59, titulo: 'Atualização para Examinador de Trânsito', subtitulo: '20h', categoria: 'Examinador', bg: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-300', textColor: 'text-white', emoji: '🔄', preco: 'R$ 440,00', productId: 'prod_gmR1aBzxgerXxhaH336AN3Hr', imagem: "/img/FORMAÇÃO_INSTRUTOR_DE_TRANSITO (1).png" },
  { id: 60, titulo: 'Pós-Graduação em Gestão e Direito de Trânsito', subtitulo: '360h', categoria: 'Pós-Graduação', bg: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-400', textColor: 'text-white', emoji: '🎓', preco: 'R$ 2000,00', productId: 'prod_p1kpZX1hLpPmw4UFtrTJbUND', imagem: "/img/pos_gestao.png" },
  { id: 61, titulo: 'Pós-Graduação em Gestão e Educação para o Trânsito', subtitulo: '360h', categoria: 'Pós-Graduação', bg: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-400', textColor: 'text-white', emoji: '🎓', preco: 'R$ 2000,00', productId: 'prod_1SKTZy4auj0JhZtaLKezuS4r', imagem: "/img/pos_educacao.png" },
  { id: 62, titulo: 'Pós-Graduação em Engenharia de Tráfego e Segurança Viária', subtitulo: '360h', categoria: 'Pós-Graduação', bg: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-400', textColor: 'text-white', emoji: '🎓', preco: 'R$ 2000,00', productId: 'prod_JFKLB6LpPykd62yKmkHx4aSx', imagem: "/img/pos_engenharia.png" },
]


// 'R$ 199,90' → 199.9
function parsePreco(preco: string): number {
  return parseFloat(preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
}

// Requisitos de categorias CNH para cursos de Formação e Atualização
const REQUISITOS_CURSOS: Record<string, string[]> = {
  'Carga Indivisível Formação': ['C', 'D', 'E'],
  'Carga Indivisível Atualização': ['C', 'D', 'E'],
  'Coletivo de Passageiros Formação': ['D', 'E'],
  'Coletivo de Passageiros Atualização': ['D', 'E'],
  'Emergência Formação': ['A', 'B', 'C', 'D', 'E'],
  'Emergência Atualização': ['A', 'B', 'C', 'D', 'E'],
  'Escolar Formação': ['D', 'E'],
  'Escolar Atualização': ['D', 'E'],
  'Produtos Perigosos - MOPP Formação': ['B', 'C', 'D', 'E'],
  'Produtos Perigosos - MOPP Atualização': ['B', 'C', 'D', 'E'],
}

// Estados permitidos para cursos de Reciclagem (por ID do curso)
const ESTADOS_RECICLAGEM: Record<number, string[]> = {
  11: ['AC', 'AL', 'DF', 'MA', 'MT', 'PE', 'RJ', 'SC', 'SE', 'SP', 'TO'],
  12: ['DF', 'ES', 'GO', 'MT', 'MS', 'PE', 'RJ', 'RS', 'SC', 'SP'],
  13: ['AC', 'AL', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'PE', 'PR', 'RJ', 'RS', 'SC', 'SE', 'SP', 'TO'],
}

type User = {
  _id: string
  nome: string
  email: string
  whatsapp: string
  cpf: string
  cnh: string
  categoriaCnh: string[]
  ufCnh: string
  dataNascimento: string
  endereco: {
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  access: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

type ValidationError = {
  hasError: boolean
  idadeOk: boolean
  categoriaOk: boolean
  requiredCategories: string[]
  userCategories: string[]
}

type ValidationErrorEstado = {
  hasError: boolean
  estadoOk: boolean
  allowedStates: string[]
  userState: string
}

// Calcula idade a partir da data de nascimento
function calcularIdade(dataNascimento: string): number {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  
  return idade
}

// Valida requisitos do curso (apenas para Formação e Atualização)
function validarRequisitoCurso(course: Course, user: User): ValidationError {
  const idadeOk = calcularIdade(user.dataNascimento) >= 21
  const requiredCategories = REQUISITOS_CURSOS[course.titulo] || []
  const categoriaOk = requiredCategories.length === 0 || requiredCategories.some(cat => user.categoriaCnh.includes(cat))

  return {
    hasError: !idadeOk || !categoriaOk,
    idadeOk,
    categoriaOk,
    requiredCategories,
    userCategories: user.categoriaCnh,
  }
}

// Valida estado permitido para cursos de Reciclagem
function validarEstadoReciclagem(courseId: number, user: User): ValidationErrorEstado {
  const allowedStates = ESTADOS_RECICLAGEM[courseId] || []
  const userState = user.endereco?.estado?.toUpperCase() || ''
  const estadoOk = allowedStates.length === 0 || allowedStates.includes(userState)

  return {
    hasError: !estadoOk,
    estadoOk,
    allowedStates,
    userState,
  }
}

export default function CursosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState('Usuário')
  const [isLogged, setIsLogged] = useState(false)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  const [courseTitle, setCourseTitle] = useState('')
  const [validationErrorEstado, setValidationErrorEstado] = useState<ValidationErrorEstado | null>(null)
  const [courseIdReciclagem, setCourseIdReciclagem] = useState<number | null>(null)

  useEffect(() => {
  startTransition(() => {
      try {
        const userStr = localStorage.getItem('user')

        if (!userStr) {
          setIsLogged(false)
          return
        }

        const user = JSON.parse(userStr)

        if (user?.nome) {
          setUserName(user.nome)
          setIsLogged(true)
        }

      } catch {
        setIsLogged(false)
      }
  })
  }, [])

  function handleCourseClick(course: Course) {
    // Verifica login
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    try {
      const user: User = JSON.parse(userStr)
      
      // Verifica se o curso requer validação (Formação ou Atualização)
      const requiresValidation = REQUISITOS_CURSOS[course.titulo] !== undefined

      if (requiresValidation) {
        const validation = validarRequisitoCurso(course, user)
        
        if (validation.hasError) {
          setValidationError(validation)
          setCourseTitle(course.titulo)
          return
        }
      }

      // Verifica se é um curso de reciclagem (id: 11, 12, 13)
      const isReciclagemCourse = [11, 12, 13].includes(course.id)
      if (isReciclagemCourse) {
        const validationEstado = validarEstadoReciclagem(course.id, user)
        
        if (validationEstado.hasError) {
          setValidationErrorEstado(validationEstado)
          setCourseIdReciclagem(course.id)
          return
        }
      }

      setLoading(true)

      // Passa nome e preço via query params para a página de pagamento
      const params = new URLSearchParams({
        name:  course.titulo,
        price: String(parsePreco(course.preco)),
        productId: course.productId,
      })
      router.push(`/pagamento?${params.toString()}`)
    } catch {
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">

      <Header />
      <WhatsappButton />

{/* Cards */}
<section className="max-w-7xl mx-auto px-5 py-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {courses.map((course) => (
      <div
        key={course.id}
        onClick={() => !loading && handleCourseClick(course)}
        className={`group relative h-[430px] overflow-hidden rounded-xl shadow-xl cursor-pointer ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {/* Imagem de fundo */}
        <img
          src={course.imagem }
          alt={course.titulo}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Conteúdo */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">

          <h3 className="text-3xl font-semibold text-white leading-tight">
            {course.titulo}
          </h3>

          {course.subtitulo && (
            <p className="mt-2 text-white/90 text-sm">
              {course.subtitulo}
            </p>
          )}

          {REQUISITOS_CURSOS[course.titulo] && (
            <p className="mt-3 text-xs text-white/80">
              Requisitos: 21 anos • Categoria{' '}
              {REQUISITOS_CURSOS[course.titulo].join(', ')}
            </p>
          )}

          <button
            className="mt-6 w-full rounded-full bg-[#f8b400] py-4 text-white font-bold transition hover:bg-[#e9a600]"
          >
            SAIBA MAIS
          </button>

        </div>
      </div>
    ))}
  </div>
</section>

      {/* Footer */}
      <Footer />

      {/* Modal de Erro de Requisitos */}
      {validationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Requisitos não cumpridos</h2>
            </div>
            
            <p className="text-gray-700 mb-4 font-semibold">{courseTitle}</p>
            
            <div className="space-y-3 mb-6">
              {/* Validação de Idade */}
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${validationError.idadeOk ? 'text-green-500' : 'text-red-500'}`}>
                  {validationError.idadeOk ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${validationError.idadeOk ? 'text-green-700' : 'text-red-700'}`}>
                    Idade mínima: 21 anos
                  </p>
                  <p className="text-sm text-gray-600">
                    {validationError.idadeOk ? '✓ Você atende este requisito' : '✗ Você não tem 21 anos ainda'}
                  </p>
                </div>
              </div>

              {/* Validação de Categoria CNH */}
              {validationError.requiredCategories.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${validationError.categoriaOk ? 'text-green-500' : 'text-red-500'}`}>
                    {validationError.categoriaOk ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${validationError.categoriaOk ? 'text-green-700' : 'text-red-700'}`}>
                      Categoria CNH requerida: {validationError.requiredCategories.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {validationError.categoriaOk 
                        ? `✓ Sua categoria ${validationError.userCategories.join(', ')} atende` 
                        : `✗ Sua categoria ${validationError.userCategories.join(', ')} não atende`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setValidationError(null)
                setCourseTitle('')
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Erro de Estado - Reciclagem */}
      {validationErrorEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Localização não permitida</h2>
            </div>
            
            <p className="text-gray-700 mb-4 font-semibold">Este curso está disponível apenas em alguns estados</p>
            
            <div className="space-y-3 mb-6">
              {/* Validação de Estado */}
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${validationErrorEstado.estadoOk ? 'text-green-500' : 'text-red-500'}`}>
                  {validationErrorEstado.estadoOk ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${validationErrorEstado.estadoOk ? 'text-green-700' : 'text-red-700'}`}>
                    Estados permitidos: {validationErrorEstado.allowedStates.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {validationErrorEstado.estadoOk 
                      ? `✓ Seu estado (${validationErrorEstado.userState}) está permitido` 
                      : `✗ Seu estado (${validationErrorEstado.userState}) não está na lista permitida`}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setValidationErrorEstado(null)
                setCourseIdReciclagem(null)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  )
}