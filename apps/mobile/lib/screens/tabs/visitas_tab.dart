import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/api_client.dart';
import '../../core/auth_provider.dart';
import 'package:intl/intl.dart';

class VisitasTab extends StatefulWidget {
  const VisitasTab({super.key});

  @override
  State<VisitasTab> createState() => _VisitasTabState();
}

class _VisitasTabState extends State<VisitasTab> {
  bool _isLoading = true;
  List<dynamic> _visitas = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final res = await apiClient.get('/operations/visitas/minhas');
      setState(() => _visitas = res as List<dynamic>? ?? []);
    } catch (_) {
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showNovaVisitaModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const _NovaVisitaForm(),
    ).then((_) => _load()); // refresh after modal closes
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
        ? const Center(child: CircularProgressIndicator())
        : _visitas.isEmpty
          ? const Center(child: Text('Nenhuma visita agendada', style: TextStyle(color: Colors.grey)))
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _visitas.length,
                itemBuilder: (ctx, i) {
                  final v = _visitas[i];
                  // v tem: nomeVisitante, dataVisita, janelaInicio, janelaFim, status
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              v['nomeVisitante'],
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: v['status'] == 'ATIVA' ? Colors.blue.withOpacity(0.2) : Colors.green.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                v['status'],
                                style: TextStyle(
                                  color: v['status'] == 'ATIVA' ? Colors.blue : Colors.green,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold
                                ),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Data: ${v['dataVisita'].toString().split('T')[0].split('-').reversed.join('/')}',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        Text(
                          'Janela: ${v['janelaInicio']} às ${v['janelaFim']}',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showNovaVisitaModal,
        icon: const Icon(Icons.add),
        label: const Text('Nova Visita/Entrega'),
        backgroundColor: Colors.blue,
      ),
    );
  }
}

class _NovaVisitaForm extends StatefulWidget {
  const _NovaVisitaForm();

  @override
  State<_NovaVisitaForm> createState() => _NovaVisitaFormState();
}

class _NovaVisitaFormState extends State<_NovaVisitaForm> {
  final _nomeCtl = TextEditingController();
  final _dataCtl = TextEditingController();
  final _inicioCtl = TextEditingController(text: '08:00');
  final _fimCtl = TextEditingController(text: '18:00');
  bool _isLoading = false;
  String _unidadeId = '';
  List<dynamic> _unidades = [];

  @override
  void initState() {
    super.initState();
    _dataCtl.text = DateFormat('yyyy-MM-dd').format(DateTime.now());
    _loadUnidades();
  }

  Future<void> _loadUnidades() async {
    final condoId = context.read<AuthProvider>().user?['condominioId'];
    if (condoId == null) return;
    try {
      final res = await apiClient.get('/facilities/condominios/$condoId/unidades');
      setState(() {
        _unidades = res as List<dynamic>? ?? [];
        if (_unidades.isNotEmpty) {
          _unidadeId = _unidades[0]['id'];
        }
      });
    } catch (_) {}
  }

  Future<void> _salvar() async {
    if (_nomeCtl.text.isEmpty || _unidadeId.isEmpty || _dataCtl.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      await apiClient.post('/operations/visitas', {
        'unidadeId': _unidadeId,
        'nomeVisitante': _nomeCtl.text.trim(),
        'dataVisita': _dataCtl.text.trim(),
        'janelaInicio': _inicioCtl.text.trim(),
        'janelaFim': _fimCtl.text.trim(),
      });
      if (mounted) Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e', style: const TextStyle(color: Colors.white)), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: 24, left: 24, right: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24
      ),
      decoration: const BoxDecoration(
        color: Color(0xFF1F2937),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('Agendar Visita/Entrega', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          if (_unidades.isNotEmpty)
            DropdownButtonFormField<String>(
              value: _unidadeId,
              decoration: _inputDeco('Sua Unidade'),
              items: _unidades.map<DropdownMenuItem<String>>((u) {
                return DropdownMenuItem<String>(
                  value: u['id'],
                  child: Text('${u['codigo']} - ${u['tipo']}'),
                );
              }).toList(),
              onChanged: (v) => setState(() => _unidadeId = v!),
            ),
          const SizedBox(height: 12),
          TextField(
            controller: _nomeCtl,
            decoration: _inputDeco('Nome do Visitante/Empresa'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _dataCtl,
            decoration: _inputDeco('Data (YYYY-MM-DD)'),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: TextField(controller: _inicioCtl, decoration: _inputDeco('Início (HH:mm)'))),
              const SizedBox(width: 12),
              Expanded(child: TextField(controller: _fimCtl, decoration: _inputDeco('Fim (HH:mm)'))),
            ],
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _isLoading ? null : _salvar,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Confirmar Agendamento', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDeco(String label) {
    return InputDecoration(
      labelText: label,
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
    );
  }
}
