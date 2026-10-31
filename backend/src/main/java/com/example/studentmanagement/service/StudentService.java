package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> findAll() {
        return repository.findAll();
    }

    public Student findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));
    }

    public Student create(Student student) {
        if (repository.existsByEmailIgnoreCase(student.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "A student with this email already exists");
        }
        return repository.save(student);
    }

    public Student update(Long id, Student input) {
        Student existing = findById(id);
        boolean emailUsedByAnotherStudent = repository.findAll().stream()
                .anyMatch(s -> !s.getId().equals(id)
                        && s.getEmail().equalsIgnoreCase(input.getEmail()));
        if (emailUsedByAnotherStudent) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "A student with this email already exists");
        }
        existing.setName(input.getName());
        existing.setEmail(input.getEmail());
        existing.setCourse(input.getCourse());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Student existing = findById(id);
        repository.delete(existing);
    }
}
