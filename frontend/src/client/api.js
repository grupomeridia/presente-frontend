import axios from "axios";

const httpClient = axios.create({
   baseURL: "http://localhost:5001",
});

const api = {
   aluno: {
      findById: (id) => httpClient.get('/api/aluno', id),
      listAll: () => httpClient.get('/api/aluno/listAll'),
      create: (alunoData) => httpClient.post('/api/aluno', alunoData),
      update: (id, alunoData) => httpClient.put('/api/aluno', id, alunoData),
      delete: (id) => httpClient.delete('/api/aluno', id),
      findChamadaByAluno: (id_aluno) => httpClient.get(`/api/aluno/HistoricoPresenca?id_aluno=` + id_aluno),
      presencasFaltas:(id_aluno) => httpClient.get(`/api/aluno/PresencaFalta?id_aluno=` + id_aluno),
      chamadasAbertas: (id_aluno) => httpClient.get(`/api/chamada/aluno?id=` + id_aluno),
      presenca: (body) => httpClient.post('/api/presenca/ra', body),
   },
   chamada: {
      findById: (id) => httpClient.get('api/chamada', id),
      listAll: () => httpClient.get('/api/chamada/listAll'),
      create: (chamada) => httpClient.post('/api/chamada', chamada),
      update: (id, chamaData) => httpClient.put('/api/chamada', id, chamaData),
      delete: (id) => httpClient.delete(`/api/chamada?id=${id}`, id),
      fecharChamada: (idChamada) => httpClient.put('/api/chamada/fecharChamada?id=' + idChamada),
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
      create: (presencaData) => httpClient.post('/api/presenca', presencaData),
      update: (id, presencaData) => httpClient.put('/api/presenca', id, presencaData),
      delete: (id) => httpClient.delete('/api/presenca', id),
      findByPresentes: () => httpClient.get('api/presenca/findByPresentes'),
   },
   professor: {
      findById: (id) => httpClient.get('api/professor', id),
      listAll: () => httpClient.get('api/professor/listAll'),
      create: (professorData) => httpClient.post('/api/professor', professorData),
      update: (id, professorData) => httpClient.put('/api/professor', id, professorData),
      delete: (id) => httpClient.delete('/api/professor', id),
      frequencia: (idProfessor, idChamada) => httpClient.get(`api/professor/numAlunos?id_professor=${idProfessor}&id_chamada=${idChamada}`),
      historicoSemanal: (idProfessor) => httpClient.get('/api/professor/historicoSemanal?id=' + idProfessor),
      mediaSemanal: (media) => httpClient.get('/api/professor/mediaSemanal?id=' + media),
      turmas: (idProfessor) => httpClient.get('/api/professor/listarTurmas?id=' + idProfessor),
      chamadasAbertas: (idProfessor) => httpClient.get('/api/chamada/listAllprofessor?id=' + idProfessor),
      presenca: (body) => httpClient.post('/api/presenca/ra', body),
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
      update: (id, turmaData) => httpClient.put('/api/turma', id, turmaData),
      delete: (id) => httpClient.delete('/api/turma', id),
      professorNaTurma: (id_turma, id_professor) => httpClient.post('/api/turma/cadastrarProfessor', id_turma, id_professor),
      alunoNaTurma: (id_turma, id_aluno) => httpClient.post('/api/turma/cadastrarAluno', id_turma, id_aluno),
   },
   materia: {
      create: (payload) => httpClient.post('api/materia', payload)
   },
   usuario: {
      create: (payload) => httpClient.post('api/usuario', payload),
      login: (payload) => httpClient.post('/api/login', payload),
   }

};

export default api;