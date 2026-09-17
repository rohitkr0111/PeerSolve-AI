@echo off
echo Starting PeerSolve Backend (Spring Boot on port 8082)...
cd /d "%~dp0"
call mvnw.cmd spring-boot:run
