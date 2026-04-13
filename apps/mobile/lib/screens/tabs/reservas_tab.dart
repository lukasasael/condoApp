import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/api_client.dart';
import '../../core/auth_provider.dart';
import 'package:intl/intl.dart';

class ReservasTab extends StatefulWidget {
  const ReservasTab({super.key});

  @override
  State<ReservasTab> createState() => _ReservasTabState();
}

class _ReservasTabState extends State<ReservasTab> {
  bool _isLoading = true;
  List<dynamic> _reservas = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final res = await apiClient.get('/operations/reservas/minhas');
      setState(() => _reservas = res as List<dynamic>? ?? []);
    } catch (_) {
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showNovaReservaModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const _NovaReservaForm(),
    ).then((_) => _load());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
        ? const Center(child: CircularProgressIndicator())
        : _reservas.isEmpty
          ? const Center(child: Text('Nenhuma reserva encontrada', style: TextStyle(color: Colors.grey)))
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _reservas.length,
                itemBuilder: (ctx, i) {
                  final r = _reservas[i];
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
                              r['areaNome'],
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: r['status'] == 'PENDENTE' ? Colors.orange.withOpacity(0.2) : Colors.green.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                r['status'],
                                style: TextStyle(
                                  color: r['status'] == 'PENDENTE' ? Colors.orange : Colors.green,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold
                                ),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Data: ${r['dataReserva'].toString().split('T')[0].split('-').reversed.join('/')}',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        Text(
                          'Horário: ${r['inicio']} às ${r['fim']}',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showNovaReservaModal,
        icon: const Icon(Icons.add),
        label: const Text('Criar Reserva'),
        backgroundColor: Colors.blue,
      ),
    );
  }
}

class _NovaReservaForm extends StatefulWidget {
  const _NovaReservaForm();

  @override
  State<_NovaReservaForm> createState() => _NovaReservaFormState();
}

class _NovaReservaFormState extends State<_NovaReservaForm> {
  final _areaCtl = TextEditingController(text: 'Salão de Festas');
  final _dataCtl = TextEditingController();
  final _inicioCtl = TextEditingController(text: '10:00');
  final _fimCtl = TextEditingController(text: '14:00');
  bool _isLoading = false;
  String _unidadeId = '';
  List<dynamic> _unidades = [];

  @override
  void initState() {
    super.initState();
    _dataCtl.text = DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 1)));
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
    if (_areaCtl.text.isEmpty || _unidadeId.isEmpty || _dataCtl.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      await apiClient.post('/operations/reservas', {
        'unidadeId': _unidadeId,
        'areaNome': _areaCtl.text.trim(),
        'dataReserva': _dataCtl.text.trim(),
        'inicio': _inicioCtl.text.trim(),
        'fim': _fimCtl.text.trim(),
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
          const Text('Reservar Área', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
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
            controller: _areaCtl,
            decoration: _inputDeco('Área (ex: Salão de Festas, Churrasqueira)'),
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
            child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Solicitar Reserva', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
