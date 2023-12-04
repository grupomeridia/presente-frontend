import axios from "axios";

const httpClient = axios.create({
   baseURL: "http://localhost:5000",
});

const api = {
   aluno: {
      findById: (id) => httpClient.get('/api/aluno?id=' + id),
      listAll: () => httpClient.get('/api/aluno/listAll'),
      presentesAusentes: (id_turma) => httpClient.get(`/api/aluno/AusentesPresentes?id_turma=` + id_turma),
      ativosInativos: (id_turma) => httpClient.get(`/api/aluno/AtivoInativo?id_turma=` + id_turma),
      mediaAtivosInativos: (id_turma) => httpClient.get(`/api/aluno/mediaAtivo?id_turma=` + id_turma),
      mediaPresentesAusentes: (id_turma) => httpClient.get(`/api/aluno/mediaAusente?id_turma=` + id_turma),
      statusAluno: (idAluno) => httpClient.get('/api/aluno/alunoStatus?id_aluno=' + idAluno),
      fetchLembretes: (cargo, idAluno) => httpClient.get(`/api/lembrete/findLembrete?cargo=${cargo}&id=${idAluno}`),
      findChamadaByAluno: (id_aluno) => httpClient.get(`/api/aluno/HistoricoPresenca?id_aluno=` + id_aluno),
      presencasFaltas: (id_aluno) => httpClient.get(`/api/aluno/PresencaFalta?id_aluno=` + id_aluno),
      chamadasAbertas: (id_aluno) => httpClient.get(`/api/chamada/aluno?id=` + id_aluno),
create: (alunoData) => httpClient.post('/api/aluno', alunoData),
      presenca: (body) => httpClient.post('/api/presenca/ra', body),
update: (id, alunoData) => httpClient.put('/api/aluno', id, alunoData),
      vizualizar: (idLembrete) => httpClient.put('/api/lembrete/visualizado?id=' + idLembrete),
delete: (id) => httpClient.delete('/api/aluno', id),
   },
   admin: {
      findByAusentes: (id_turma) => httpClient.get(`/api/aluno/AusentesPresentes?id_turma=` + id_turma),
      lembrete: (payload) => httpClient.post('/api/lembrete', payload)
   },
   chamada: {
      findById: (id) => httpClient.get('api/chamada', id),
      listAll: () => httpClient.get('/api/chamada/listAll'),
      obterUltimaChamada: (idProfessor) => httpClient.get('/api/chamada/ultimaChamada?id=' + idProfessor),
      create: (chamada) => httpClient.post('/api/chamada', chamada),
      update: (id, chamaData) => httpClient.put('/api/chamada', id, chamaData),
      fecharChamada: (idChamada) => httpClient.put('/api/chamada/fecharChamada?id=' + idChamada),
      delete: (id) => httpClient.delete(`/api/chamada?id=${id}`, id),
   },
   configuracao: {
      findById: (id) => httpClient.get('api/configuracao', id),
      listAll: () => httpClient.get('api/configuracao/listAll'),
      create: (configuracaoData) => httpClient.post('/api/configuracao', configuracaoData),
      update: (id, configuracaoData) => httpClient.put('/api/configuracao/', id, configuracaoData),
      delete: (id) => httpClient.delete('/api/configuracao/', id),
   },
   presenca: {
      findById: (id) => httpClient.get('api/presenca', id),
      listAll: () => httpClient.get('api/presenca/listAll'),
      findByPresentes: () => httpClient.get('api/presenca/findByPresentes'),
      create: (presencaData) => httpClient.post('/api/presenca', presencaData),
      update: (id, presencaData) => httpClient.put('/api/presenca', id, presencaData),
      delete: (id) => httpClient.delete('/api/presenca', id),

   },
   professor: {
      findById: (id) => httpClient.get('api/professor', id),
      listAll: () => httpClient.get('api/professor/listAll'),
      frequencia: (idProfessor, idChamada) => httpClient.get(`api/professor/numAlunos?id_professor=${idProfessor}&id_chamada=${idChamada}`),
      historicoSemanal: (idProfessor) => httpClient.get('/api/professor/historicoSemanal?id=' + idProfessor),
      mediaSemanal: (media) => httpClient.get('/api/professor/mediaSemanal?id=' + media),
      turmas: (idProfessor) => httpClient.get('/api/professor/listarTurmas?id=' + idProfessor),
      chamadasAbertas: (idProfessor) => httpClient.get('/api/chamada/listAllprofessor?id=' + idProfessor),
      create: (professorData) => httpClient.post('/api/professor', professorData),
      presenca: (body) => httpClient.post('/api/presenca/ra', body),
      update: (id, professorData) => httpClient.put('/api/professor', id, professorData),
      delete: (id) => httpClient.delete('/api/professor', id),
   },
   projeto: {
      findById: (id) => httpClient.get('api/projeto', id),
      listAll: () => httpClient.get('api/projeto/listAll'),
      create: (projetoData) => httpClient.post('/api/projeto', projetoData),
      update: (id, projetoData) => httpClient.put('/api/projeto', id, projetoData),
      delete: (id) => httpClient.delete('/api/projeto', id),
   },
   turma: {
      findById: (id) => httpClient.get('api/turma', id),
      listAll: () => httpClient.get('api/turma/listAll'),
      create: (turmaData) => httpClient.post('/api/turma', turmaData),
      professorNaTurma: (id_turma, id_professor) => httpClient.post('/api/turma/cadastrarProfessor', id_turma, id_professor),
      alunoNaTurma: (id_turma, id_aluno) => httpClient.post('/api/turma/cadastrarAluno', id_turma, id_aluno),
      update: (id, turmaData) => httpClient.put('/api/turma', id, turmaData),
      delete: (id) => httpClient.delete('/api/turma', id),
   },
   materia: {
      listAll: () => httpClient.get('api/materia/listAll'),
      create: (payload) => httpClient.post('api/materia', payload),
   },
   usuario: {
      create: (payload) => httpClient.post('api/usuario', payload),
      login: (payload) => httpClient.post('/api/login', payload),
   }

};

export default api;