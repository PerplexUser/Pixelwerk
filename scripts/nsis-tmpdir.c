/* Optional Linux build compatibility: NSIS's libc tmpfile() ignores TMPDIR.
 * Keep temporary compiler storage in the explicitly chosen writable directory.
 * Does not change permissions, filesystem checks, or the generated application.
 * Build: gcc -shared -fPIC -o nsis-tmpdir.so scripts/nsis-tmpdir.c
 */
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>

static FILE *workspace_tempfile(void) {
    const char *directory = getenv("TMPDIR");
    if (!directory || !*directory) directory = "/tmp";
    char *name = NULL;
    if (asprintf(&name, "%s/pixelwerk-compiler-XXXXXX", directory) < 0) return NULL;
    int fd = mkstemp(name), saved_errno = errno;
    if (fd >= 0) unlink(name);
    free(name);
    if (fd < 0) { errno = saved_errno; return NULL; }
    FILE *stream = fdopen(fd, "w+b");
    if (!stream) { saved_errno = errno; close(fd); errno = saved_errno; }
    return stream;
}
FILE *tmpfile(void) { return workspace_tempfile(); }
FILE *tmpfile64(void) { return workspace_tempfile(); }
