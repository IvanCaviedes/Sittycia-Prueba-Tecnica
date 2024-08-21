using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Request
{
    public class UpdatePasswordRequest
    {
        [Required (ErrorMessage = "La contraseña es obligatoria.")]
        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }

        [Required (ErrorMessage = "La contraseña es obligatoria.")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
    }
}
