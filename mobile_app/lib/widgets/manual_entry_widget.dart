import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/scanner_provider.dart';

class ManualEntryWidget extends StatelessWidget {
  const ManualEntryWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Manual Entry',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),

            // Code Input Field
            Consumer<ScannerProvider>(
              builder: (context, provider, child) {
                return TextField(
                  onChanged: provider.setManualCode,
                  decoration: InputDecoration(
                    labelText: 'Enter 8-digit code',
                    hintText: 'ABC12345',
                    border: const OutlineInputBorder(),
                    prefixIcon: const Icon(Icons.keyboard),
                    counterText: '${provider.manualCode.length}/8',
                  ),
                  textCapitalization: TextCapitalization.characters,
                  maxLength: 8,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 18,
                    letterSpacing: 2,
                  ),
                );
              },
            ),

            const SizedBox(height: 16),

            // Action Buttons
            Consumer<ScannerProvider>(
              builder: (context, provider, child) {
                final isCodeValid = provider.manualCode.length == 8;

                return Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: (provider.isLoading || !isCodeValid)
                            ? null
                            : provider.verifyManualCode,
                        icon: provider.isLoading
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Icon(Icons.visibility),
                        label: Text(provider.isLoading
                            ? 'Verifying...'
                            : 'Verify Only'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: (provider.isLoading || !isCodeValid)
                            ? null
                            : provider.checkInManualCode,
                        icon: provider.isLoading
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(Icons.check_circle),
                        label: Text(
                            provider.isLoading ? 'Checking In...' : 'Check In'),
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
