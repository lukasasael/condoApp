import 'package:flutter/material.dart';
import '../../core/api_client.dart';

class ComunicadosTab extends StatefulWidget {
  const ComunicadosTab({super.key});

  @override
  State<ComunicadosTab> createState() => _ComunicadosTabState();
}

class _ComunicadosTabState extends State<ComunicadosTab> {
  bool _isLoading = true;
  List<dynamic> _comunicados = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final res = await apiClient.get('/governance/comunicados');
      setState(() => _comunicados = res as List<dynamic>? ?? []);
    } catch (_) {
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_comunicados.isEmpty) {
      return const Center(
        child: Text('Nenhum comunicado da administração.', style: TextStyle(color: Colors.grey)),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _comunicados.length,
        itemBuilder: (ctx, i) {
          final c = _comunicados[i];
          final date = DateTime.parse(c['publicadoEm']).toLocal();
          
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
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
                  children: [
                    const Icon(Icons.campaign, color: Colors.blue, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        c['titulo'], 
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  c['conteudo'],
                  style: const TextStyle(color: Colors.white70, height: 1.4),
                ),
                const SizedBox(height: 16),
                Text(
                  'Publicado por ${c['autorNome']} em ${date.day}/${date.month}/${date.year}',
                  style: const TextStyle(color: Colors.grey, fontSize: 11),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
