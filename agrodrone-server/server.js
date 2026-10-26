
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use((req, res, next) => {
      console.log(`[AgroDrone] ${req.method} ${req.url}`);
        next();
        });
        
 const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.get("/", (req, res) => {
  res.json({ status: "ok", servidor: "AgroDrone AI" });
  });

  app.post("/analisar", async (req, res) => {
    try {
        if (!ai) {
              return res.status(500).json({
                      erro: "A chave GEMINI_API_KEY não está configurada no servidor."
                            });
                                }

                                    const { imagem, mimeType, observacao = "" } = req.body;

                                        if (!imagem || !mimeType || !mimeType.startsWith("image/")) {
                                              return res.status(400).json({
                                                      erro: "Envie uma imagem válida e seu tipo MIME."
                                                            });
                                                                }

                                                                    const resultado = await ai.models.generateContent({
                                                                          model: "gemini-3.5-flash",
                                                                                contents: [{
                                                                                        role: "user",
                                                                                                parts: [
                                                                                                          {
                                                                                                                      text: `Você é um assistente de observação agrícola especializado em cana-de-açúcar.
                                                                                                                      Analise somente os sinais visíveis na foto.
                                                                                                                      Observação do trabalhador: ${observacao}
                                                                                                                      Descreva sinais visíveis de pragas, danos, amarelecimento, doenças aparentes ou falhas.
                                                                                                                      Separe observações visuais de hipóteses. Não afirme diagnóstico definitivo, não invente detalhes e diga quando a foto não permitir concluir.
                                                                                                                      Não recomende agrotóxicos nem doses.
                                                                                                                      Finalize recomendando confirmação em campo por profissional agrícola.`
                                                                                                                                },
                                                                                                                                          {
                                                                                                                                                      inlineData: {
                                                                                                                                                                    mimeType,
                                                                                                                                                                                  data: imagem
                                                                                                                                                                                              }
                                                                                                                                                                                                        }
                                                                                                                                                                                                                ]
                                                                                                                                                                                                                      }]
                                                                                                                                                                                                                          });

                                                                                                                                                                                                                              res.json({
                                                                                                                                                                                                                                    analise: resultado.text || "O modelo não retornou texto. Tente outra foto."
                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                          } catch (erro) {
                                                                                                                                                                                                                                              console.error("Falha na análise:", erro.message);
                                                                                                                                                                                                                                                  res.status(500).json({
                                                                                                                                                                                                                                                        erro: "Não foi possível analisar a imagem. Confira a conexão e a configuração do servidor."
                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                                              app.listen(PORT, "0.0.0.0", () => {
                                                                                                                                                                                                                                                                console.log(`AgroDrone AI disponível na porta ${PORT}`);
                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                