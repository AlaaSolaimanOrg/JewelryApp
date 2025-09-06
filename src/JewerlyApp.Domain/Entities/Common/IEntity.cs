using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities.Common
{
    public interface IEntity
    {
        void AddCreatedByData(int? userId);

        /// <summary>
        /// AddUpdatedByData
        /// </summary>
        /// <param name="user"></param>
        void AddUpdatedByData(int? userId);
    }
}
