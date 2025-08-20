import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import '../providers/scanner_provider.dart';
import '../widgets/result_widget.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  bool isScanning = true;

  @override
  void reassemble() {
    super.reassemble();
    if (controller != null) {
      controller!.pauseCamera();
      controller!.resumeCamera();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Scanner'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          IconButton(
            icon: Icon(isScanning ? Icons.pause : Icons.play_arrow),
            onPressed: () {
              setState(() {
                isScanning = !isScanning;
                if (isScanning) {
                  controller?.resumeCamera();
                } else {
                  controller?.pauseCamera();
                }
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 4,
            child: Stack(
              children: [
                QRView(
                  key: qrKey,
                  onQRViewCreated: _onQRViewCreated,
                  overlay: QrScannerOverlayShape(
                    borderColor: Theme.of(context).colorScheme.primary,
                    borderRadius: 10,
                    borderLength: 30,
                    borderWidth: 10,
                    cutOutSize: 250,
                  ),
                ),
                Positioned(
                  bottom: 20,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Position the QR code within the frame to scan',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.white,
                          ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: Consumer<ScannerProvider>(
                          builder: (context, provider, child) {
                            return ElevatedButton.icon(
                              onPressed: provider.isLoading
                                  ? null
                                  : () {
                                      _scanForVerification();
                                    },
                              icon: const Icon(Icons.visibility),
                              label: Text(provider.isLoading
                                  ? 'Verifying...'
                                  : 'Verify Only'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    Theme.of(context).colorScheme.secondary,
                                foregroundColor:
                                    Theme.of(context).colorScheme.onSecondary,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Consumer<ScannerProvider>(
                          builder: (context, provider, child) {
                            return ElevatedButton.icon(
                              onPressed: provider.isLoading
                                  ? null
                                  : () {
                                      _scanForCheckIn();
                                    },
                              icon: const Icon(Icons.check_circle),
                              label: Text(provider.isLoading
                                  ? 'Checking In...'
                                  : 'Check In'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    Theme.of(context).colorScheme.primary,
                                foregroundColor:
                                    Theme.of(context).colorScheme.onPrimary,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Result Display
                  Consumer<ScannerProvider>(
                    builder: (context, provider, child) {
                      if (provider.lastResult != null) {
                        return const Expanded(child: ResultWidget());
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      // Auto-pause after scan
      controller.pauseCamera();
      setState(() {
        isScanning = false;
      });

      // Process the scanned data
      _processScannedData(scanData.code);
    });
  }

  void _processScannedData(String? data) {
    if (data == null || data.isEmpty) return;

    try {
      // Try to parse as JSON (QR code data)
      final Map<String, dynamic> qrData = {};
      if (data.startsWith('{')) {
        // It's JSON QR data
        final parsed = data; // You might want to parse JSON here
        // Extract the alphanumeric code from QR data
        // For now, we'll assume the data is the alphanumeric code
      }

      // For simplicity, treat the scanned data as the alphanumeric code
      final code = data.length == 8 ? data : data.substring(0, 8);

      // Show dialog to choose action
      _showActionDialog(code);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Invalid QR code format: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showActionDialog(String code) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('QR Code Scanned'),
          content: Text('Code: $code\n\nWhat would you like to do?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<ScannerProvider>().verifyCode(code);
              },
              child: const Text('Verify Only'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<ScannerProvider>().checkInGuest(code);
              },
              child: const Text('Check In'),
            ),
          ],
        );
      },
    );
  }

  void _scanForVerification() {
    // Resume camera and wait for next scan
    controller?.resumeCamera();
    setState(() {
      isScanning = true;
    });
  }

  void _scanForCheckIn() {
    // Resume camera and wait for next scan
    controller?.resumeCamera();
    setState(() {
      isScanning = true;
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
