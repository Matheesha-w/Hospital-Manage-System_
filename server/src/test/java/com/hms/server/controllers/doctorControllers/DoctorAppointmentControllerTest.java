package com.hms.server.controllers.doctorControllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.server.controllers.doctor.DoctorAppointmentController;
import com.hms.server.dto.doctor.DoctorAppointmentDtos;
import com.hms.server.service.doctor.DoctorAppointmentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = DoctorAppointmentController.class, useDefaultFilters = false,
  includeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = DoctorAppointmentController.class)
)
@ImportAutoConfiguration(exclude = {
  org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
  org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class,
  org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
class DoctorAppointmentControllerTest {

    private static final String BASE = "/api/doctor/appointments";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DoctorAppointmentService doctorAppointmentService;

    private DoctorAppointmentDtos.ResponseItem sample() {
        DoctorAppointmentDtos.ResponseItem r = new DoctorAppointmentDtos.ResponseItem();
        r.setId("a1");
        r.setPatientId("p1");
        r.setPatientName("John Doe");
        r.setDoctorId("d1");
        r.setDoctorName("Dr. Who");
        r.setDoctorEmail("dr.who@example.com");
        r.setDoctorSpecialization("General Medicine");
        r.setStatus("SCHEDULED");
        r.setReason("Follow-up");
        r.setAppointmentAt(LocalDateTime.now().plusDays(1));
        return r;
    }

    @Nested
    @DisplayName("Read")
    class ReadTests {
        @Test
        @WithMockUser(roles = "DOCTOR")
        void listMine_ok() throws Exception {
            given(doctorAppointmentService.listMyAppointments()).willReturn(List.of(sample()));

            mvc.perform(get(BASE))
               .andExpect(status().isOk())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.success").value(true))
               .andExpect(jsonPath("$.message").value("Appointments fetched"))
               .andExpect(jsonPath("$.data", hasSize(1)))
               .andExpect(jsonPath("$.data[0].patientName").value("John Doe"));
        }

        @Test
        @WithMockUser(roles = "DOCTOR")
        void listMine_empty_ok() throws Exception {
            given(doctorAppointmentService.listMyAppointments()).willReturn(List.of());

            mvc.perform(get(BASE))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true))
               .andExpect(jsonPath("$.data", hasSize(0)));
        }
    }

    @Nested
    @DisplayName("Slice Security Behavior")
    class SliceSecurityBehavior {
        @Test
        @WithMockUser(roles = "PATIENT")
        void patient_allows_in_slice() throws Exception {
            given(doctorAppointmentService.listMyAppointments()).willReturn(List.of());
            mvc.perform(get(BASE))
               .andExpect(status().isOk());
        }
    }
}
