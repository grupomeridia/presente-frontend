import axios from 'axios';
import api from '@/client/api';
import { actionAsyncStorage } from 'next/dist/client/components/action-async-storage.external';
import { execOnce } from 'next/dist/shared/lib/utils';

jest.mock('axios', () => ({
    create: jest.fn().mockReturnThis(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

describe('API client', () => {

    it('deve buscar um aluno pelo ID', async () => {
        const mockResponse = { data: { id_usuario: 123, status: true, ausente: false, nome: "Aluno", ra: 123455 } };
        axios.create().get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.findById(123);
        expect(axios.create().get).toHaveBeenCalledWith('/api/aluno?id=123');
        expect(response).toEqual(mockResponse);
    });

    // Repita testes semelhantes para listAll, create, update, delete, etc.
    it('deve criar um novo aluno', async () => {
        const newAlunoData = { id_usuario: 123, status: true, ausente: false, nome: "Aluno", ra: 123455 };
        const mockResponse = { data: newAlunoData };
        axios.create().post.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.create(newAlunoData);
        expect(axios.create().post).toHaveBeenCalledWith('/api/aluno', newAlunoData);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar todos os alunos', async () => {
        const mockResponse = {
            data:
                [
                    { id_usuario: 123, status: true, ausente: false, nome: "Aluno", ra: 123455 },
                    { id_usuario: 124, status: true, ausente: false, nome: "Aluno", ra: 123456 }
                ]
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.listAll();
        expect(axios.get).toHaveBeenCalledWith('/api/aluno/listAll');
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar o número de presentes e ausentes de uma turma', async () => {
        const idTurma = 123;
        const mockResponse = { data: { presentes: 10, ausentes: 5 } };
        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.presentesAusentes(idTurma);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/AusentesPresentes?id_turma=${idTurma}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar o número de alunos ativos e inativos de uma turma', async () => {
        const idTurma = 123;
        const mockResponse = { data: { ativos: 20, inativos: 10 } };
        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.ativosInativos(idTurma);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/AtivoInativo?id_turma=${idTurma}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar a média de alunos ativos e inativos de uma turma', async () => {
        const idTurma = 123;
        const mockResponse = { data: 75 }; // Supondo que 75 seja a média
        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.mediaAtivosInativos(idTurma);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/mediaAtivo?id_turma=${idTurma}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar a media de alunos presentes e ausentes de uma turma', async () => {
        const idTurma = 123;
        const mockResponse = { data: 80 };
        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.mediaPresentesAusentes(idTurma);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/mediaAusente?id_turma=${idTurma}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar o status do aluno', async () => {
        const idAluno = 1;
        const mockResponse = {
            data:
                { id_aluno: 1, status: true, nome: "Aluno", ra: 123456, curso: "Curso", presencas: 12, falatas: 12, frequencia: 23.3 }
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.statusAluno(idAluno);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/alunoStatus?id_aluno=${idAluno}`);
        expect(response).toEqual(mockResponse);

    });

    it('deve buscar o lembrete pelo cargo e o id do usuario', async () => {
        const idAluno = 1;
        const cargo = 'Aluno';

        const mockResponse = {
            data:
                {id: 1, Titulo:"Titulo", mensagem:"mensagem"}
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.fetchLembretes(cargo,idAluno);
        expect(axios.get).toHaveBeenCalledWith(`/api/lembrete/findLembrete?cargo=${cargo}&id=${idAluno}`)
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar o lembrete pelo cargo e o id do usuario e vir nulo', async () => {
        const idAluno = 1;
        const cargo = 'Aluno';

        const mockResponse = {
            data:
                {}
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.fetchLembretes(cargo,idAluno);
        expect(axios.get).toHaveBeenCalledWith(`/api/lembrete/findLembrete?cargo=${cargo}&id=${idAluno}`)
        expect(response).toEqual(mockResponse);
    });

    it("deve buscar as chamadas de um aluno", async () =>{
        const idAluno = 1;
        const mockResponse = {
            data:
                { id_presenca:1, nome:"Aluno", status:true, horario:"12/08/2023 19:08:23", tipo_presenca:"Manual" }
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        const response = await api.aluno.findChamadaByAluno(idAluno);

        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/HistoricoPresenca?id_aluno=${idAluno}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve buscar presenças e faltas de um aluno', async () => {
        const idAluno = 123;
        const mockResponse = { 
          data: { 
            nome: "Nome do Aluno", 
            presencas: 20, 
            faltas: 5 
          } 
        };
        axios.get.mockResolvedValueOnce(mockResponse);
      
        const response = await api.aluno.presencasFaltas(idAluno);
        expect(axios.get).toHaveBeenCalledWith(`/api/aluno/PresencaFalta?id_aluno=${idAluno}`);
        expect(response).toEqual(mockResponse);
    });
      
    it('deve buscar chamadas abertas para um aluno', async () => {
        const idAluno = 123;
        const mockResponse = { 
          data: [
            {
              professor_nome: "Professor A", 
              materia_nome: "Matéria X", 
              id_chamada: 456, 
              abertura: "08:00:00", 
              fechamento: "10:00:00"
            },
            // Adicionar mais chamadas, se necessário
          ]
        };
        axios.get.mockResolvedValueOnce(mockResponse);
      
        const response = await api.aluno.chamadasAbertas(idAluno);
        expect(axios.get).toHaveBeenCalledWith(`/api/chamada/aluno?id=${idAluno}`);
        expect(response).toEqual(mockResponse);
    });

    it('deve registrar a presença de um aluno', async () => {
        const mockBody = {
          cargo_manual: "Professor",
          id_manual: 123,
          ra: 654321
        };
        const mockResponse = { data: { /* dados da resposta */ }};
        axios.post.mockResolvedValueOnce(mockResponse);
      
        const response = await api.aluno.presenca(mockBody);
        expect(axios.post).toHaveBeenCalledWith('/api/presenca/ra', mockBody);
        expect(response).toEqual(mockResponse);
    });

    it('deve marcar um lembrete como visualizado', async () => {
        const idLembrete = 123;
        const mockResponse = { 
          data: { 
            idCriador: 456, 
            titulo: "Título do Lembrete", 
            mensagem: "Mensagem do Lembrete" 
          } 
        };

        axios.put.mockResolvedValueOnce(mockResponse);
      
        const response = await api.aluno.vizualizar(idLembrete);
        expect(axios.put).toHaveBeenCalledWith(`/api/lembrete/visualizado?id=${idLembrete}`);
        expect(response).toEqual(mockResponse);
    });
      
}); 
