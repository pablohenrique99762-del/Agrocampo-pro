
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
                                                                                                                      
                                                                                                                      Analise somente o que for possível observar na imagem e considere também a observação do trabalhador: ${observacao}
                                                                                                                      
                                                                                                                      Organize o relatório usando estes títulos:
                                                                                                                      
                                                                                                                      ### 1. Observações visuais
                                                                                                                      Descreva objetivamente os sinais visíveis na foto, como danos, manchas, insetos, alterações de cor ou falhas. Não afirme características que não possam ser vistas.
                                                                                                                      
                                                                                                                      ### 2. Hipóteses e possibilidades
                                                                                                                      Apresente possíveis pragas, doenças ou outras causas somente quando houver indícios visuais compatíveis. Explique que são hipóteses, não diagnósticos confirmados.
                                                                                                                      
                                                                                                                      ### 3. Limitações da imagem
                                                                                                                      Informe o que não pode ser concluído com a foto e quais informações ou imagens adicionais ajudariam.
                                                                                                                      
                                                                                                                      ### 4. Próximos passos no campo
                                                                                                                      Apresente recomendações práticas de campo relacionadas aos sinais observados:
                                                                                                                      - Verifique outras plantas próximas para saber se o problema se repete.
                                                                                                                      - Fotografe as partes da planta que ajudem na identificação.
                                                                                                                      - Registre o local, a data e a quantidade de plantas com sinais semelhantes.
                                                                                                                      - Procure um engenheiro agrônomo ou outro profissional qualificado quando necessário.
                                                                                                                      
                                                                                                                      Adapte as orientações à imagem e à observação do trabalhador. Se não houver evidência suficiente, explique o que precisa ser verificado antes de concluir. Não invente níveis de infestação, não prescreva tratamentos e não indique agrotóxicos ou dosagens.
                                                                                                                      
                                                                                                                      ### 5. Conclusão
                                                                                                                      Resuma os principais sinais observados e indique o grau de confiança qualitativo da avaliação (baixo, moderado ou alto), justificando-o pela qualidade e quantidade de evidências visíveis.
                                                                                                                      
                                                                                                                      Não apresente suspeitas como fatos confirmados. Não recomende agrotóxicos, misturas ou dosagens. Responda em português brasileiro, com linguagem clara e objetiva.`,
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

                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                