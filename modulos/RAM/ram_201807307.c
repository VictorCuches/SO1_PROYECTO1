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
#include <linux/sysinfo.h>
#include <linux/sched.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR(" ");
MODULE_DESCRIPTION("Proyecto1 SOPES1");

#if LINUX_VERSION_CODE >= KERNEL_VERSION(4,18,0)
#define HAVE_PROC_CREATE_SINGLE
#endif

struct sysinfo ram;

static int getRamInfo(struct seq_file *archivo, void *v) {
    long totalram;  /* Tamaño total de memoria principal utilizable */
    long freeram;   /* Tamaño de memoria disponible */
    long sharedram; /* Cantidad de memoria compartida */
    long bufferram; /* Memoria utilizada por los búferes */
    long totalswap; /* Tamaño total del espacio de intercambio */
    long freeswap;  /* Todavía hay espacio de intercambio disponible */
    int mem_unit;   /* Tamaño de la unidad de memoria en bytes */

    long ram_total;
    long ram_ocupada;
    long ram_libre;
    long ram_porcentaje;
    long cached;
    si_meminfo(&ram);

    totalram = ram.totalram;
    freeram = ram.freeram;
    sharedram = ram.sharedram;
    bufferram = ram.bufferram;
    totalswap = ram.totalswap;
    freeswap = ram.freeswap;
    mem_unit = ram.mem_unit;

    cached=global_node_page_state(NR_FILE_PAGES)-global_node_page_state(QC_SPACE)-bufferram;

    if(cached < 0){
        cached = 0;
    }

    cached = cached*mem_unit/1024/1024;
    sharedram=sharedram*mem_unit/1024/1024;
    bufferram=bufferram*mem_unit/1024/1024;

    ram_total=totalram*mem_unit/1024/1024;
    ram_libre=freeram*mem_unit/1024/1024;
    ram_ocupada=ram_total-ram_libre-cached+bufferram;
    ram_porcentaje=ram_ocupada*100/ram_total;

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\t\"Total\": %li,\n",ram_total);
    seq_printf(archivo, "\t\"Usado\": %li,\n",ram_ocupada);
    seq_printf(archivo, "\t\"Libre\": %li,\n",ram_libre);
    seq_printf(archivo, "\t\"Compartido\": %li,\n",sharedram);
    seq_printf(archivo, "\t\"Cache\": %li,\n",cached);
    seq_printf(archivo, "\t\"Buffer\": %li,\n",bufferram);
    seq_printf(archivo, "\t\"Porcentaje\": %li\n",ram_porcentaje);
    seq_printf(archivo, "}\n");

    return 0;
};

//Funcion que se ejecuta cuando se le hace un cat al modulo.
#ifndef HAVE_PROC_CREATE_SINGLE
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, getRamInfo, NULL);
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
    proc_create_single("ram_201901604", 0, NULL, getRamInfo);
#else
    proc_create("ram_201901604", 0, NULL, &operaciones);
#endif
    printk(KERN_INFO "201901604\n");
    return 0;
}

static void __exit _remove(void)
{
    remove_proc_entry("ram_201901604", NULL);
    printk(KERN_INFO "Sistemas Operativos 1\n");
}

module_init(_insert);
module_exit(_remove);