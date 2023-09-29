#include <linux/module.h> 
// para usar KERN_INFO
#include <linux/kernel.h> 
//Header para los macros module_init y module_exit
#include <linux/init.h> 
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h> 
/* for copy_from_user */
#include <asm/uaccess.h> 
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h> 
#include <linux/version.h>

#include <linux/hugetlb.h>         
#include <linux/sched.h>
#include <linux/sched/signal.h>

#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Victor Cuches");
MODULE_DESCRIPTION("Proyecto1");

#if LINUX_VERSION_CODE >= KERNEL_VERSION(4,18,0)
#define HAVE_PROC_CREATE_SINGLE
#endif

char buffer[256];
struct task_struct *procesos, *sub_procesos;
struct list_head *subProcesos;
unsigned long memo_ram;

char * get_procesos_state(long state){
    switch (state){
        case TASK_RUNNING:
            return "Ejecucion";
            
        case TASK_INTERRUPTIBLE:
            return "Suspendido";
            
        case TASK_UNINTERRUPTIBLE:
            return "Suspendido";

        case __TASK_STOPPED:
            return "Suspendido";
            
        case __TASK_TRACED: 
            return "Detenido";
            
        case TASK_STOPPED:
            return "Detenido";
            
        case EXIT_ZOMBIE:
            return "Zombie";
                
        default:
            sprintf(buffer, "Desconocido %ld", state);
            return buffer;
    }
}

int get_procesos_state_id(long state){
    switch (state){
        case TASK_RUNNING:
            return 0;
        case TASK_INTERRUPTIBLE:
            return 1;
        case TASK_UNINTERRUPTIBLE:
            return 1;
        case __TASK_STOPPED:
            return 1;
        case __TASK_TRACED:
            return 2;
        case TASK_STOPPED:
            return 2;
        case EXIT_ZOMBIE:
            return 3;
        default:
            return 4;
    }
}

static int getCpuInfo(struct seq_file *archivo, void *v) {
    int estado = -1;
    int procesos_ejecucion = 0;
    int procesos_suspendidos = 0;
    int procesos_detenidos = 0;
    int procesos_zombies = 0;
    int procesos_desconocidos = 0;
    int total_procesos = 0;

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"Procesos\": [\n");
    for_each_process(procesos){

            estado = get_procesos_state_id(procesos->__state);

            if(estado == 0){
                procesos_ejecucion = procesos_ejecucion + 1;
            }else if(estado == 1){
                procesos_suspendidos = procesos_suspendidos + 1;
            }else if(estado == 2){
                procesos_detenidos = procesos_detenidos + 1;
            }else if(estado == 3){
                procesos_zombies = procesos_zombies + 1;
            }else{
                procesos_desconocidos = procesos_desconocidos + 1;
            }

        total_procesos = total_procesos + 1;

        seq_printf(archivo, "{\n");
        seq_printf(archivo, "\t\"Pid\":%d,\n", procesos->pid);
        seq_printf(archivo, "\t\"Nombre\":\"%s\",\n", procesos->comm);
        //----seq_printf(archivo, "\t\"Estado\":%li,\n", procesos->state);
        seq_printf(archivo, "\t\"Estado\":\"%s\",\n", get_procesos_state(procesos->__state));
        
        // seq_printf(archivo, "\t\"User\":%d,\n", procesos->cred->uid.val); ANTES
        // seq_printf(archivo, "\t\"User\":%d,\n", __kuid_val(procesos->real_cred->uid));
        seq_printf(archivo, "      \"User\" : %1i,\n", __kuid_val(procesos->real_cred->uid));

        // seq_printf(file, "      \"uid\" : %1i,\n", __kuid_val(process->real_cred->uid)); PROBAR ESTE!!

        memo_ram = 0;
        if (procesos->mm){
            memo_ram = get_mm_rss(procesos->mm);
        }

        // seq_printf(archivo, "\t\"Ram\":%d,\n", memo_ram);
        seq_printf(archivo, "      \"Ram\" : %lu,\n", memo_ram);

        //----mm para el porcentaje de ram
        seq_printf(archivo, "\t\"Hijos\":[\n");
        
        list_for_each(subProcesos,&(procesos->children)){
            sub_procesos=list_entry(subProcesos, struct task_struct, sibling);
            seq_printf(archivo, "\t\t{\n");
            seq_printf(archivo, "\t\t\"Pid\":%d,\n", sub_procesos->pid);
            seq_printf(archivo, "\t\t\"Nombre\":\"%s\"\n", sub_procesos->comm);
            seq_printf(archivo, "\t\"Estado\":\"%s\",\n", get_procesos_state(sub_procesos->__state));
            seq_printf(archivo, "\t\t},\n");
        }

        seq_printf(archivo,"\t]\n");
        seq_printf(archivo,"},\n");
    }
    seq_printf(archivo, "],\n");
    seq_printf(archivo, "\"Informacion\":[{\n");
    seq_printf(archivo, "\t\"ProcesosEjecucion\": %d,\n", procesos_ejecucion);
    seq_printf(archivo, "\t\"ProcesosSuspendidos\": %d,\n", procesos_suspendidos);
    seq_printf(archivo, "\t\"ProcesosDetenidos\": %d,\n", procesos_detenidos);
    seq_printf(archivo, "\t\"ProcesosZombies\": %d,\n", procesos_zombies);
    seq_printf(archivo, "\t\"ProcesosDesconocidos\": %d,\n", procesos_desconocidos);
    seq_printf(archivo, "\t\"TotalProcesos\": %d \n", total_procesos);
    seq_printf(archivo, "}],\n");
    seq_printf(archivo, "\"Porcentaje\":[{\n");
    seq_printf(archivo, "\t\"PorcentajeUso\": %lli \n", (procesos->stime)/1000000000);
    seq_printf(archivo, "}]\n");
    seq_printf(archivo, "}\n");
    return 0;
};

//Funcion que se ejecuta cuando se le hace un cat al modulo.
#ifndef HAVE_PROC_CREATE_SINGLE
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, getCpuInfo, NULL);
}

// Si el su Kernel es 5.6 o mayor
static const struct file_operations operaciones =
{
    .owner = THIS_MODULE,
    .open = al_abrir,
    .read = seq_read,
    .llseek = seq_lseek,
    .release = single_release
};
#endif

static int __init _insert(void)
{
#ifdef HAVE_PROC_CREATE_SINGLE
    proc_create_single("cpu_201807307", 0, NULL, getCpuInfo);
#else
    proc_create("cpu_201807307", 0, NULL, &operaciones);
#endif
    printk(KERN_INFO "Victor Cuches de Leon\n");
    return 0;
}

static void __exit _remove(void)
{
    remove_proc_entry("cpu_201807307", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);