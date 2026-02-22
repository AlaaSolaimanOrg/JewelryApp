using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities.Common
{
    public abstract class Entity<TId> : IEntity where TId : notnull
    {
        #region Props

        public TId Id { get; init; }

        /// <summary>
        /// Created Date
        /// </summary>
        public DateTime? CreatedDate { get;  set; } = DateTime.UtcNow;

        /// <summary>
        /// Created By
        /// </summary>
        public int? CreatedBy { get;  set; }

        /// <summary>
        /// Last Updated Date
        /// </summary>
        public DateTime? LastUpdatedDate { get;  set; }

        /// <summary>
        /// Last Updated By
        /// </summary>
        public int? LastUpdatedBy { get;  set; }

        #endregion

        /// <summary>
        /// AddCreatedByData
        /// </summary>
        /// <param name="user"></param>
        public void AddCreatedByData(int? userId)
        {
            CreatedDate = DateTime.UtcNow;
            if (userId is not null && CreatedBy == null)
            {
                CreatedBy = userId;
            }
        }

        

        /// <summary>
        /// AddUpdatedByData
        /// </summary>
        /// <param name="user"></param>
        public void AddUpdatedByData(int? userId)
        {

            LastUpdatedDate = DateTime.UtcNow;
            if (userId is not null)
            {
                LastUpdatedBy = userId;
            }
        }

        
    }
}
