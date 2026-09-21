import os
import random

languages = {
    "C": ("src/core_engine.c", "#include <stdio.h>\nint main() { printf(\"Core Engine Initialized.\\n\"); return 0; }"),
    "C++": ("src/memory_manager.cpp", "#include <iostream>\nint main() { std::cout << \"Memory Manager Online.\\n\"; return 0; }"),
    "Java": ("services/auth/AuthService.java", "public class AuthService { public static void main(String[] args) { System.out.println(\"Auth Service Running\"); } }"),
    "Python": ("services/ml/prediction_model.py", "def predict():\n    return 'Model ready'"),
    "Ruby": ("scripts/deploy.rb", "puts 'Deploying infrastructure...'"),
    "Go": ("services/router/main.go", "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"Router initialized\") }"),
    "Rust": ("src/crypto_module.rs", "fn main() { println!(\"Crypto module loaded.\"); }"),
    "PHP": ("public/api/v1/endpoints.php", "<?php echo 'API v1 active'; ?>"),
    "Swift": ("mobile/ios/AppController.swift", "import Foundation\nprint(\"App Controller started\")"),
    "Kotlin": ("mobile/android/MainActivity.kt", "fun main() { println(\"Android Activity ready\") }"),
    "TypeScript": ("frontend/src/App.tsx", "export const App = () => <div>App</div>;"),
    "Shell": ("scripts/ci_cd.sh", "#!/bin/bash\necho 'Running CI/CD pipeline'"),
    "Scala": ("data/pipeline/SparkJob.scala", "object SparkJob extends App { println(\"Data pipeline running\") }"),
    "Haskell": ("src/compiler/Parser.hs", "main = putStrLn \"Parser ready\""),
    "Lua": ("config/nginx_lua/rate_limit.lua", "print('Rate limit config loaded')"),
    "Perl": ("scripts/legacy/cleanup.pl", "print \"Cleanup script running\\n\";"),
    "R": ("analytics/stats_model.R", "print('Stats model active')"),
    "Objective-C": ("mobile/ios/legacy/AppDelegate.m", "#import <Foundation/Foundation.h>\nint main() { NSLog(@\"Delegate ready\"); return 0; }"),
    "Dart": ("mobile/flutter/lib/main.dart", "void main() { print('Flutter app started'); }"),
    "Elixir": ("services/realtime/ws_handler.ex", "IO.puts \"WebSocket handler ready\""),
    "Clojure": ("src/backend/core.clj", "(println \"Backend core active\")"),
    "F#": ("services/finance/Ledger.fs", "printfn \"Ledger system online\""),
    "Erlang": ("services/telecom/switch.erl", "-module(switch).\n-export([start/0]).\nstart() -> io:format(\"Switch ready~n\")."),
    "Groovy": ("jenkins/Jenkinsfile.groovy", "println 'Jenkins pipeline loaded'"),
    "Julia": ("analytics/quantum_sim.jl", "println(\"Quantum sim ready\")"),
    "Assembly": ("src/low_level/boot.asm", "section .text\nglobal _start\n_start:\n"),
    "OCaml": ("src/compiler/typecheck.ml", "print_endline \"Typechecker ready\""),
    "Crystal": ("services/fast_api/server.cr", "puts \"Crystal server running\""),
    "Nim": ("scripts/tools/sys_monitor.nim", "echo \"System monitor active\""),
    "Zig": ("src/embedded/controller.zig", "const std = @import(\"std\");\npub fn main() void { std.debug.print(\"Controller ready\", .{}); }"),
    "V": ("src/tools/builder.v", "fn main() { println('Builder ready') }"),
    "Vala": ("src/desktop/main.vala", "void main () { print (\"Desktop app ready\\n\"); }"),
    "Ada": ("src/aerospace/navigation.adb", "with Ada.Text_IO; use Ada.Text_IO;\nprocedure Navigation is\nbegin\n  Put_Line(\"Nav system online\");\nend Navigation;"),
    "Fortran": ("src/legacy/weather_model.f90", "program weather\n  print *, 'Weather model ready'\nend program weather"),
    "Cobol": ("src/legacy/banking.cbl", "IDENTIFICATION DIVISION.\nPROGRAM-ID. BANKING.\nPROCEDURE DIVISION.\n  DISPLAY 'Banking system ready'.\n  STOP RUN."),
    "Pascal": ("src/legacy/ui_lib.pas", "program ui_lib;\nbegin\n  writeln('UI library ready');\nend."),
    "Prolog": ("src/ai/rules.pl", "ready :- write('Rules loaded')."),
    "Lisp": ("src/ai/expert_system.lisp", "(print \"Expert system ready\")"),
    "Scheme": ("src/ai/evaluator.scm", "(display \"Evaluator ready\")"),
    "Racket": ("src/tools/macro_expander.rkt", "#lang racket\n(displayln \"Macro expander ready\")"),
    "ActionScript": ("src/legacy/flash_player.as", "trace('Flash player ready');"),
    "ColdFusion": ("src/legacy/webapp.cfm", "<cfoutput>Webapp ready</cfoutput>"),
    "Delphi": ("src/legacy/windows_app.pas", "program windows_app;\nbegin\n  writeln('Windows app ready');\nend."),
    "Tcl": ("scripts/automation/gui_test.tcl", "puts \"GUI test ready\""),
    "Verilog": ("hardware/cpu_core.v", "module cpu_core;\n  initial $display(\"CPU core ready\");\nendmodule"),
    "VHDL": ("hardware/memory_controller.vhd", "entity memory_controller is end;"),
    "MATLAB": ("analytics/signal_processing.m", "disp('Signal processing ready')"),
    "Smalltalk": ("src/oop/object_model.st", "Transcript show: 'Object model ready'"),
    "Awk": ("scripts/data_processing/parser.awk", "BEGIN { print \"Parser ready\" }"),
    "Sed": ("scripts/data_processing/replacer.sed", "s/foo/bar/g"),
    "Makefile": ("Makefile", "all:\n\t@echo 'Build ready'"),
    "CMake": ("CMakeLists.txt", "message(\"CMake configured\")"),
    "Docker": ("Dockerfile", "FROM ubuntu:latest\nRUN echo 'Docker ready'"),
    "Brainfuck": ("src/esoteric/optimizer.bf", "++++++[>++++++++++<-]>+++++.")
}

os.makedirs("enterprise_architecture", exist_ok=True)

for lang, (filepath, content) in languages.items():
    full_path = os.path.join("enterprise_architecture", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        # Repeat content a few times to increase file size to bias github stats
        f.write(content + "\n" + (content + "\n") * 50)

# Create .gitattributes to hide HTML and emphasize Assembly or C++ as "hardest"
with open(".gitattributes", "w") as f:
    f.write("*.html linguist-detectable=false\n")
    f.write("*.css linguist-detectable=false\n")
    f.write("*.js linguist-detectable=false\n")
    f.write("*.json linguist-detectable=false\n")
    f.write("*.asm linguist-detectable=true\n")
    f.write("*.cpp linguist-detectable=true\n")
    f.write("*.c linguist-detectable=true\n")
    f.write("*.rs linguist-detectable=true\n")

print("Created 50+ language dummy files in enterprise_architecture/")
