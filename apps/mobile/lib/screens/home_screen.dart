import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/auth_provider.dart';
import 'tabs/comunicados_tab.dart';
import 'tabs/visitas_tab.dart';
import 'tabs/reservas_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final _tabs = const [
    ComunicadosTab(),
    VisitasTab(),
    ReservasTab(),
  ];

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('CondoApp', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('Olá, ${user?['nome'] ?? ''}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: () => context.read<AuthProvider>().logout(),
          )
        ],
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
      ),
      body: _tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        backgroundColor: const Color(0xFF111827),
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.campaign), label: 'Mural'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Visitas'),
          BottomNavigationBarItem(icon: Icon(Icons.event_available), label: 'Reservas'),
        ],
      ),
    );
  }
}
