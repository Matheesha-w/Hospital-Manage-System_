package com.hms.server.service;

import com.hms.server.model.*;
import com.hms.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@Profile("seed")
public class NurseDataInitializationService implements CommandLineRunner {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private MedicationRepository medicationRepository;
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Only initialize if data doesn't exist
        if (patientRepository.count() > 0) {
            return;
        }
        
        // Create sample medications
        createSampleMedications();
        
        // Create sample patients
        createSamplePatients();
        
        // Create sample prescriptions
        createSamplePrescriptions();
    }
    
    private void createSampleMedications() {
        List<Medication> medications = Arrays.asList(
            new Medication(
                null, "Paracetamol", "Acetaminophen", "Tablet", 500.0, "mg",
                "Pain reliever and fever reducer", 
                Arrays.asList("Liver disease", "Alcoholism"),
                Arrays.asList("Nausea", "Rash", "Liver damage"),
                "Generic Pharma", "BATCH001", LocalDateTime.now().plusYears(2),
                false, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Medication(
                null, "Ibuprofen", "Ibuprofen", "Tablet", 400.0, "mg",
                "Anti-inflammatory pain reliever",
                Arrays.asList("Stomach ulcers", "Heart disease"),
                Arrays.asList("Stomach upset", "Dizziness", "Headache"),
                "Generic Pharma", "BATCH002", LocalDateTime.now().plusYears(2),
                false, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Medication(
                null, "Morphine", "Morphine Sulfate", "Injection", 10.0, "mg",
                "Strong pain reliever for severe pain",
                Arrays.asList("Respiratory depression", "Head injury"),
                Arrays.asList("Drowsiness", "Nausea", "Constipation", "Respiratory depression"),
                "Controlled Pharma", "BATCH003", LocalDateTime.now().plusYears(1),
                true, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Medication(
                null, "Insulin", "Human Insulin", "Injection", 100.0, "units",
                "Blood sugar control for diabetes",
                Arrays.asList("Hypoglycemia", "Allergy to insulin"),
                Arrays.asList("Hypoglycemia", "Weight gain", "Injection site reactions"),
                "Diabetes Pharma", "BATCH004", LocalDateTime.now().plusYears(1),
                false, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Medication(
                null, "Amoxicillin", "Amoxicillin", "Capsule", 250.0, "mg",
                "Antibiotic for bacterial infections",
                Arrays.asList("Penicillin allergy"),
                Arrays.asList("Diarrhea", "Nausea", "Rash", "Allergic reactions"),
                "Antibiotic Pharma", "BATCH005", LocalDateTime.now().plusYears(2),
                false, true, LocalDateTime.now(), LocalDateTime.now()
            )
        );
        
        medicationRepository.saveAll(medications);
    }
    
    private void createSamplePatients() {
        List<Patient> patients = Arrays.asList(
            new Patient(
                null, "P001", "John", "Doe", "john.doe@email.com", "555-0101",
                LocalDate.of(1985, 5, 15), "123 Main St, City, State",
                "Jane Doe", "555-0102", "O+",
                Arrays.asList("Penicillin", "Shellfish"),
                Arrays.asList("Diabetes", "Hypertension"),
                null, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Patient(
                null, "P002", "Sarah", "Smith", "sarah.smith@email.com", "555-0201",
                LocalDate.of(1990, 8, 22), "456 Oak Ave, City, State",
                "Mike Smith", "555-0202", "A+",
                Arrays.asList("Latex"),
                Arrays.asList("Asthma"),
                null, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Patient(
                null, "P003", "Robert", "Johnson", "robert.johnson@email.com", "555-0301",
                LocalDate.of(1978, 12, 3), "789 Pine St, City, State",
                "Lisa Johnson", "555-0302", "B-",
                Arrays.asList("Aspirin"),
                Arrays.asList("Heart Disease", "High Cholesterol"),
                null, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Patient(
                null, "P004", "Emily", "Brown", "emily.brown@email.com", "555-0401",
                LocalDate.of(1995, 3, 10), "321 Elm St, City, State",
                "David Brown", "555-0402", "AB+",
                Arrays.asList(),
                Arrays.asList("Migraine"),
                null, true, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Patient(
                null, "P005", "Michael", "Wilson", "michael.wilson@email.com", "555-0501",
                LocalDate.of(1982, 7, 28), "654 Maple Dr, City, State",
                "Susan Wilson", "555-0502", "O-",
                Arrays.asList("Morphine"),
                Arrays.asList("Chronic Pain", "Depression"),
                null, true, LocalDateTime.now(), LocalDateTime.now()
            )
        );
        
        patientRepository.saveAll(patients);
    }
    
    private void createSamplePrescriptions() {
        // Get medications and patients
        List<Medication> medications = medicationRepository.findAll();
        List<Patient> patients = patientRepository.findAll();
        
        if (medications.isEmpty() || patients.isEmpty()) {
            return;
        }
        
        // Create sample prescriptions
        List<Prescription> prescriptions = Arrays.asList(
            new Prescription(
                null, "RX001", patients.get(0).getPatientId(), "DOCTOR001",
                medications.get(0).getId(), medications.get(0).getName(),
                500.0, "mg", "Every 6 hours as needed for pain",
                LocalDateTime.now().minusDays(2), LocalDateTime.now().plusDays(5),
                30, 25, "Take with food", "Patient has mild headache",
                Prescription.PrescriptionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Prescription(
                null, "RX002", patients.get(1).getPatientId(), "DOCTOR002",
                medications.get(1).getId(), medications.get(1).getName(),
                400.0, "mg", "Twice daily with meals",
                LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(7),
                14, 12, "Take with plenty of water", "Anti-inflammatory for joint pain",
                Prescription.PrescriptionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Prescription(
                null, "RX003", patients.get(2).getPatientId(), "DOCTOR003",
                medications.get(2).getId(), medications.get(2).getName(),
                10.0, "mg", "Every 4 hours for severe pain",
                LocalDateTime.now().minusHours(6), LocalDateTime.now().plusDays(3),
                20, 18, "Monitor for respiratory depression", "Post-surgical pain management",
                Prescription.PrescriptionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Prescription(
                null, "RX004", patients.get(0).getPatientId(), "DOCTOR001",
                medications.get(3).getId(), medications.get(3).getName(),
                100.0, "units", "Before each meal",
                LocalDateTime.now().minusDays(5), LocalDateTime.now().plusDays(25),
                100, 95, "Check blood sugar before administration", "Type 2 diabetes management",
                Prescription.PrescriptionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()
            ),
            new Prescription(
                null, "RX005", patients.get(3).getPatientId(), "DOCTOR004",
                medications.get(4).getId(), medications.get(4).getName(),
                250.0, "mg", "Three times daily",
                LocalDateTime.now().minusDays(3), LocalDateTime.now().plusDays(4),
                21, 18, "Complete full course", "Bacterial infection treatment",
                Prescription.PrescriptionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()
            )
        );
        
        prescriptionRepository.saveAll(prescriptions);
    }
}

