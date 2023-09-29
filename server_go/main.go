package main

import (
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/shirou/gopsutil/cpu"
	"io/ioutil"
	"os/exec"
	"strings"
	"time"
)

type datosRam struct {
	Total      int32
	Usado      int32
	Libre      int32
	Compartido int32
	Cache      int32
	Buffer     int32
	Porcentaje int32
}

type datosCpu struct {
	Procesos    []procesos
	Informacion []informacion
	Porcentaje  []porcentaje
}

type procesos struct {
	Pid    int32
	Nombre string
	Estado string
	User   int32
	Ram    int32
	Hijos  []hijos
}

type hijos struct {
	Pid    int32
	Nombre string
}

type porcentaje struct {
	PorcentajeUso int32
}

type informacion struct {
	ProcesosEjecucion    int32
	ProcesosSuspendidos  int32
	ProcesosDetenidos    int32
	ProcesosZombies      int32
	ProcesosDesconocidos int32
	TotalProcesos        int32
}

type RequestBody struct {
	PidApp int `json:"pid_app"`
}

var dataram datosRam

var datacpu datosCpu

var contador int = 1

func main() {

	// Crea una nueva instancia de la aplicación GoFiber
	app := fiber.New()

	// Configura el middleware CORS para aceptar cualquier origen
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET, POST, PUT, DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("PROYECTO #1")
	})

	app.Get("/infoRam", func(c *fiber.Ctx) error {
		infoRam()
		return c.JSON(dataram)
	})

	app.Get("/infoCpu", func(c *fiber.Ctx) error {
		infoCpu()
		return c.JSON(datacpu)
	})

	app.Get("/cpu_porcentaje", func(c *fiber.Ctx) error {
		fmt.Println("***** cpu *****")
		cmd := exec.Command("sh", "-c", "ps -eo pcpu | sort -k 1 -r | head -100")
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println("error")
			// return c.Status(500).SendString("Error al obtener el porcentaje de CPU")
		}
		data := strings.Replace(string(out[:]), "\n", ",", -1)
		data = "[" + data[5:len(data)-1] + "]"

		// Crear un mapa para el JSON de respuesta
		response := map[string]string{
			"porcentajeCPU": data,
		}

		return c.JSON(response)
	})

	app.Post("/killProcess", func(c *fiber.Ctx) error {
		fmt.Println("***** kill pid *****")
		// Parsea el cuerpo JSON en una estructura RequestBody
		var requestBody RequestBody
		if err := c.BodyParser(&requestBody); err != nil {
			fmt.Println("ERROR 1: ", err.Error())
			return c.Status(400).JSON(fiber.Map{
				"state": false,
				"error": "Error al analizar el cuerpo JSON",
			})
		}

		// Obtiene el valor de pid_app de la estructura RequestBody
		pidApp := requestBody.PidApp

		command_kill := "kill -9 " + fmt.Sprintf("%d", pidApp)
		// Ejecuta el comando para matar el proceso con el PID especificado
		cmd := exec.Command("sh", "-c", command_kill)

		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println("ERROR 2: ", err.Error())
			return c.Status(500).JSON(fiber.Map{
				"state": false,
				"error": fmt.Sprintf("Error al matar el proceso con PID %d: %s", pidApp, err.Error()),
			})
		}

		// Mensaje de éxito
		response := fiber.Map{
			"state":   true,
			"message": fmt.Sprintf("Proceso con PID %d eliminado con éxito", string(out[:])),
		}

		// Devuelve el mensaje JSON como respuesta
		return c.JSON(response)
	})

	app.Get("/cpu_usage", func(c *fiber.Ctx) error {
		fmt.Println("***** porcentaje uso cpu *****")
		// Obtiene el porcentaje de utilización de la CPU durante 1 segundo
		percent, err := cpu.Percent(1*time.Second, false)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener la utilización de la CPU")
		}

		// El resultado es un slice con un valor por cada núcleo de CPU
		// Puedes calcular el promedio o usar el valor de un núcleo específico según tus necesidades
		averageUsage := 0.0
		for _, p := range percent {
			averageUsage += p
		}
		averageUsage /= float64(len(percent))

		// Retorna el porcentaje de utilización de la CPU como JSON
		return c.JSON(fiber.Map{"cpu_usage": averageUsage})
	})

	app.Get("/porcentaje_uso_cpu", func(c *fiber.Ctx) error {
		cpuUsage, err := getCPUUsage()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"cpu_porcentaje": cpuUsage,
		})
	})

	// Inicia el servidor en el puerto 8080
	app.Listen(":8080")
}

func infoRam() {
	fmt.Println("***** modulo ram *****")
	cmd := exec.Command("sh", "-c", "cat /proc/ram_201807307")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])

	errors := json.Unmarshal([]byte(output), &dataram)
	if errors != nil {
		fmt.Println(errors)
	}

	// fmt.Println(dataram)
	fmt.Println("")
}

// func infoCpuPorcentaje() {
// 	fmt.Println("***** cpu *****")
// 	cmd := exec.Command("sh", "-c", "ps -eo pcpu | sort -k 1 -r | head -100")
// 	out, err := cmd.CombinedOutput()
// 	if err != nil {
// 		fmt.Println("error")
// 		// return c.Status(500).SendString("Error al obtener el porcentaje de CPU")
// 	}
// 	data := strings.Replace(string(out[:]), "\n", ",", -1)
// 	data = "[" + data[5:len(data)-1] + "]"

// 	// Crear un mapa para el JSON de respuesta
// 	response := map[string]string{
// 		"porcentajeCPU": data,
// 	}
// 	return c.JSON(response)
// }

func infoCpu() {
	fmt.Println("***** modulo cpu *****")
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201807307")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])

	split1 := strings.Split(output, "\"Informacion\"")

	split2 := strings.Split(split1[0], "\"Hijos\"")

	tempsplit := ""

	for i := 0; i < len(split2); i++ {
		split3 := strings.Split(split2[i], "]")
		for j := 0; j < len(split3); j++ {
			if split3[j][0] == 58 {
				if len(split3[j]) != 4 {
					for z := 0; z < len(split3[j])-3; z++ {
						tempsplit = tempsplit + string([]byte{split3[j][z]})
					}
					for p := len(split3[j]) - 2; p < len(split3[j]); p++ {
						tempsplit = tempsplit + string([]byte{split3[j][p]})
					}
					tempsplit = tempsplit + "]"
				} else {
					tempsplit = tempsplit + split3[j] + "]"
				}
			} else {
				tempsplit = tempsplit + split3[j]
			}
		}
		tempsplit = tempsplit + "\"Hijos\""
	}

	tempres := ""

	for i := 0; i < len(tempsplit)-11; i++ {
		tempres = tempres + string([]byte{tempsplit[i]})
	}

	tempres = tempres + "],\"Informacion\"" + split1[1]

	errors := json.Unmarshal([]byte(tempres), &datacpu)
	if errors != nil {
		fmt.Println(errors)
	}

	// fmt.Println(datacpu)
	fmt.Println("")
}

func useCpu() {
	fmt.Println("DATOS OBTENIDOS DESDE EL MODULO CPU :")
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201807307")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])

	split1 := strings.Split(output, "\"Informacion\"")

	split2 := strings.Split(split1[0], "\"Hijos\"")

	tempsplit := ""

	for i := 0; i < len(split2); i++ {
		split3 := strings.Split(split2[i], "]")
		for j := 0; j < len(split3); j++ {
			if split3[j][0] == 58 {
				if len(split3[j]) != 4 {
					for z := 0; z < len(split3[j])-3; z++ {
						tempsplit = tempsplit + string([]byte{split3[j][z]})
					}
					for p := len(split3[j]) - 2; p < len(split3[j]); p++ {
						tempsplit = tempsplit + string([]byte{split3[j][p]})
					}
					tempsplit = tempsplit + "]"
				} else {
					tempsplit = tempsplit + split3[j] + "]"
				}
			} else {
				tempsplit = tempsplit + split3[j]
			}
		}
		tempsplit = tempsplit + "\"Hijos\""
	}

	tempres := ""

	for i := 0; i < len(tempsplit)-11; i++ {
		tempres = tempres + string([]byte{tempsplit[i]})
	}

	tempres = tempres + "],\"Informacion\"" + split1[1]

	errors := json.Unmarshal([]byte(tempres), &datacpu)
	if errors != nil {
		fmt.Println(errors)
	}

	fmt.Println(datacpu)
	fmt.Println("")
}

func delaySecond(n time.Duration) {
	time.Sleep(n * time.Second)
}

func getCPUUsage() (float64, error) {
	content, err := ioutil.ReadFile("/proc/stat")
	if err != nil {
		return 0, err
	}

	statData := string(content)
	lines := strings.Split(statData, "\n")

	for _, line := range lines {
		if strings.HasPrefix(line, "cpu ") {
			fields := strings.Fields(line)
			var user, nice, system, idle, iowait, irq, softirq, steal, guest, guestnice int
			fmt.Sscanf(fields[1], "%d", &user)
			fmt.Sscanf(fields[2], "%d", &nice)
			fmt.Sscanf(fields[3], "%d", &system)
			fmt.Sscanf(fields[4], "%d", &idle)
			fmt.Sscanf(fields[5], "%d", &iowait)
			fmt.Sscanf(fields[6], "%d", &irq)
			fmt.Sscanf(fields[7], "%d", &softirq)
			fmt.Sscanf(fields[8], "%d", &steal)
			fmt.Sscanf(fields[9], "%d", &guest)
			fmt.Sscanf(fields[10], "%d", &guestnice)

			total := user + nice + system + idle + iowait + irq + softirq + steal
			userCpu := user - guest + nice - guestnice
			cpuUsage := float64(userCpu) / float64(total) * 100.0
			return cpuUsage, nil
		}
	}

	return 0, fmt.Errorf("No se pudo encontrar la línea 'cpu' en /proc/stat")
}
