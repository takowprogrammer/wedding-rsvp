class Guest {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final int numberOfGuests;
  final String? dietaryRestrictions;
  final String? specialRequests;
  final String status;
  final bool checkedIn;
  final DateTime createdAt;

  Guest({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    required this.numberOfGuests,
    this.dietaryRestrictions,
    this.specialRequests,
    required this.status,
    required this.checkedIn,
    required this.createdAt,
  });

  factory Guest.fromJson(Map<String, dynamic> json) {
    return Guest(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      phone: json['phone'],
      numberOfGuests: json['numberOfGuests'],
      dietaryRestrictions: json['dietaryRestrictions'],
      specialRequests: json['specialRequests'],
      status: json['status'],
      checkedIn: json['checkedIn'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  String get fullName => '$firstName $lastName';
}

class ScanResult {
  final bool success;
  final String message;
  final Guest? guest;
  final bool? used;

  ScanResult({
    required this.success,
    required this.message,
    this.guest,
    this.used,
  });

  factory ScanResult.fromJson(Map<String, dynamic> json) {
    return ScanResult(
      success: json['success'] ?? json['valid'] ?? false,
      message: json['message'] ?? 'Unknown error',
      guest: json['guest'] != null ? Guest.fromJson(json['guest']) : null,
      used: json['used'],
    );
  }
}
