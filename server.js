const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { PDFDocument, rgb } = require("pdf-lib");

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: "*",  // Permite requisições de qualquer origem
    methods: ["GET", "POST", "OPTIONS"],  // Permite os métodos desejados
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions)); 
app.options("*", cors(corsOptions)); // Permite preflight requests (CORS)

app.use(express.json());  // Para processar JSON corretamente
app.use(express.urlencoded({ extended: true }));  // Para processar formulários


// Pasta onde os modelos de PDF estão armazenados
const PDF_FOLDER = path.join(__dirname, "modelos_pdf");

// Criar pasta se não existir
if (!fs.existsSync(PDF_FOLDER)) fs.mkdirSync(PDF_FOLDER);

async function preencherPDF(dados) {
    try {
        console.log("🔹 Iniciando preenchimento do PDF...");

        const { contrato, observacao } = dados;
        console.log("📄 Contrato recebido:", contrato);
        console.log("📝 Observação recebida:", observacao);

        // Caminho do modelo de PDF
        const pdfPath = path.join(PDF_FOLDER, `${contrato}.pdf`);
        console.log("📂 Caminho do arquivo PDF:", pdfPath);

        if (!fs.existsSync(pdfPath)) {
            console.error("❌ Erro: Modelo de PDF não encontrado!");
            return { error: `Modelo de PDF (${contrato}.pdf) não encontrado.` };
        }

        // Carrega o PDF
        console.log("📥 Lendo o arquivo PDF...");
        const existingPdfBytes = fs.readFileSync(pdfPath);
        console.log("✅ Arquivo PDF lido com sucesso! Tamanho:", existingPdfBytes.length, "bytes");

        console.log("📜 Carregando documento PDF...");
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("✅ Documento carregado!");

        const pages = pdfDoc.getPages();
        console.log("📄 Total de páginas no PDF:", pages.length);

        if (pages.length === 0) {
            console.error("❌ Erro: O PDF não contém páginas!");
            return { error: "O PDF não contém páginas." };
        }

        const page = pages[0];
        console.log("✏️ Página selecionada para edição.");

        // Obtém a data atual
        const dataAtual = new Date();
        const dia = dataAtual.getDate();
        const mes = dataAtual.getMonth() + 1;
        const ano = dataAtual.getFullYear();

        /// Adiciona texto ao PDF
        const fontSize = 11;
        console.log("🖊️ Adicionando textos ao PDF...");

        // Divide a observação em linhas
        const linhas = observacao.split("\n");

        // Objeto para armazenar os valores extraídos
        let valoresExtraidos = {};

        // Processa cada linha e extrai o conteúdo após o ":"
        linhas.forEach((linha, index) => {
            const partes = linha.split(":");
            if (partes.length > 1) {
                const chave = partes[0].trim(); // Texto antes do ":"
                const valor = partes.slice(1).join(":").trim(); // Texto depois do ":"
                valoresExtraidos[`${index + 1}`] = valor;
            }
        });

        function limparTextoParaPDF(texto) {
            if (!texto) return ""; // Evita erros com valores nulos ou undefined
            return texto
                .split(" ") // Divide o texto em palavras
                .map(palavra => palavra.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,;:!?()'"%-]/g, "")) // Remove caracteres inválidos, preservando letras acentuadas e pontuação
                .join(" "); // Reagrupa as palavras com espaços
        }        
        
        // Itera sobre cada campo extraído e remove caracteres inválidos
        for (const key in valoresExtraidos) {
            let textoOriginal = valoresExtraidos[key];
            let textoLimpo = limparTextoParaPDF(textoOriginal);
        
            console.log(`🔍 Campo ${key}: Original -> "${textoOriginal}"`);
            console.log(`✅ Campo ${key}: Limpo -> "${textoLimpo}"`);
        
            valoresExtraidos[key] = textoLimpo; // Atualiza o objeto com o texto limpo
        }
        
        console.log("valoresExtraidos = ", valoresExtraidos)

        // Exemplo: Escrevendo os valores no PDF (posição ajustável) Contrato
        for (const key in valoresExtraidos) {
            if(contrato == '204' || contrato == '304' || contrato == 'alvin') {
                if(key == 1) { // NOME
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 100, 
                        y: 696, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                    
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 110, 
                        y: 282, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 2) { // CPF
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 90, 
                        y: 262, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 3) { // QUANTIDADE DE PESSOAS
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 180, 
                        y: 647, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 4) { // DATA DE ENTRADA
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 400, 
                        y: 696, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 5) { // DATA DE SAIDA
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 80, 
                        y: 675, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 6) { // VALOR PAGO
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 305, 
                        y: 582, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 7) { // VALOR TOTAL
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 255, 
                        y: 597, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 8) { // ENDEREÇO
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 270, 
                        y: 262, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 9) { // TELEFONE
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 95, 
                        y: 225, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                page.drawText(dia.toString(), { x: 265, y: 180, size: fontSize, color: rgb(0, 0, 0) });
                page.drawText(mes.toString(), { x: 340, y: 180, size: fontSize, color: rgb(0, 0, 0) });
                page.drawText(ano.toString(), { x: 485, y: 180, size: fontSize, color: rgb(0, 0, 0) });
            }

            if(contrato == 'bragao') {
                if(key == 1) { // NOME
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 100, 
                        y: 690, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                    
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 110, 
                        y: 276, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 2) { // CPF
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 90, 
                        y: 256, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 3) { // QUANTIDADE DE PESSOAS
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 180, 
                        y: 641, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 4) { // DATA DE ENTRADA
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 400, 
                        y: 690, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 5) { // DATA DE SAIDA
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 80, 
                        y: 670, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 6) { // VALOR PAGO
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 305, 
                        y: 576, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 7) { // VALOR TOTAL
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 255, 
                        y: 591, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 8) { // ENDEREÇO
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 270, 
                        y: 256, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                if(key == 9) { // TELEFONE
                    page.drawText(`${valoresExtraidos[key]}`, { 
                        x: 95, 
                        y: 222, 
                        size: fontSize, 
                        color: rgb(0, 0, 0) 
                    });
                }
                page.drawText(dia.toString(), { x: 265, y: 180, size: fontSize, color: rgb(0, 0, 0) });
                page.drawText(mes.toString(), { x: 340, y: 180, size: fontSize, color: rgb(0, 0, 0) });
                page.drawText(ano.toString(), { x: 485, y: 180, size: fontSize, color: rgb(0, 0, 0) });
            }
        }

        console.log("✅ Textos adicionados!");

        // Gera o PDF na memória
        console.log("💾 Salvando o novo PDF...");
        const pdfBytes = await pdfDoc.save();
        console.log("✅ PDF gerado! Tamanho final:", pdfBytes.length, "bytes");

        return { pdfBytes };
    } catch (error) {
        console.error("❌ Erro ao preencher o PDF:", error.message);
        return { error: error.message };
    }
}

// Rota para processar o preenchimento do PDF e enviar sem salvar
app.get("/gerar_pdf", async (req, res) => {
    let { contrato, observacao } = req.query;

    if (!contrato) {
        return res.status(400).json({ error: "Contrato não especificado." });

        valoresExtraidos
    }

    console.log('contrato', contrato);
    observacao = decodeURIComponent(observacao);
    observacao = observacao.normalize("NFC");  // Converte para a forma correta
    console.log('observacao', observacao);

    
    const resultado = await preencherPDF({ contrato, observacao });

    if (resultado.error) {
        return res.status(500).json({ error: resultado.error });
    }

    // Define o cabeçalho para download direto do PDF sem salvar
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Contrato_Preenchido.pdf");
    res.send(Buffer.from(resultado.pdfBytes));
});

// Rota para listar os contratos disponíveis
app.get("/listar_contratos", (req, res) => {
    fs.readdir(PDF_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao listar contratos." });
        }
        // Filtra apenas arquivos PDF e remove a extensão ".pdf"
        const contratos = files.filter(file => file.endsWith(".pdf")).map(file => file.replace(".pdf", ""));
        res.json({ contratos });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
